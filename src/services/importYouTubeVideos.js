import axios from 'axios';
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

const pb = new PocketBase(process.env.POCKETBASE_URL); // Assurez-vous que l'URL est correcte
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// Fonction pour authentifier en tant qu'administrateur
async function authenticateAdmin() {
    try {
      const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
      console.log('Authentification admin réussie.');
    } catch (error) {
      console.error('Erreur lors de l\'authentification admin :', error.message);
      
      // Si l'erreur a un objet 'response', essayer de loguer plus d'infos
      if (error.response) {
        console.error('Détails de l\'erreur HTTP :', error.response.data);
        console.error('Status de l\'erreur HTTP :', error.response.status);
      } else {
        console.error('Erreur réseau ou autre erreur de connexion:', error);
      }
  
      // Vérifier si 'error' est un objet complet avec des détails internes
      console.error('Détails internes de l\'erreur :', error);
      
      process.exit(1); // Arrête le script en cas d'erreur
    }
  }
  

// Récupère toutes les playlists du canal YouTube
async function fetchYouTubePlaylists() {
  let playlists = [];
  let nextPageToken = null;
  
  do {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlists`, {
      params: {
        part: 'snippet',
        channelId: CHANNEL_ID,
        key: YOUTUBE_API_KEY,
        maxResults: 50,
        pageToken: nextPageToken,
      },
    });
    
    playlists = playlists.concat(response.data.items);
    nextPageToken = response.data.nextPageToken;  // Récupérer le token de la page suivante
  } while (nextPageToken);
  
  return playlists;
}

// Synchronise les playlists YouTube avec PocketBase
async function syncPlaylists() {
  const playlists = await fetchYouTubePlaylists();
  const playlistSyncPromises = playlists.map(playlist => syncPlaylist(playlist)); // Synchroniser chaque playlist en parallèle
  
  await Promise.all(playlistSyncPromises);  // Attendre la fin de toutes les synchronisations
  console.log('Toutes les playlists ont été synchronisées');
}

// Synchronise une playlist spécifique avec PocketBase
async function syncPlaylist(playlist) {
  try {
    const existingPlaylist = await pb.collection('playlists').getFirstListItem(`playlistId="${playlist.id}"`);
    // Si la playlist existe déjà, on passe à la suivante
  } catch (error) {
    if (error.status === 404) {
      await pb.collection('playlists').create({
        playlistId: playlist.id,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnailUrl: playlist.snippet.thumbnails.medium.url,
      });
      console.log(`Playlist ajoutée : ${playlist.snippet.title}`);
    } else {
      console.error('Erreur lors de la récupération de la playlist :', error);
    }
  }

  // Synchronise les vidéos de cette playlist
  await syncPlaylistVideos(playlist.id);  
}

// Synchronise les vidéos d'une playlist spécifique avec PocketBase
async function syncPlaylistVideos(playlistId) {
  const videos = await fetchPlaylistVideos(playlistId);

  for (const video of videos) {
    const videoId = video.contentDetails.videoId;
    try {
      const existingVideo = await pb.collection('videos').getFirstListItem(`videoId="${videoId}"`);
      // Si la vidéo existe déjà, on passe à la suivante
    } catch (error) {
      if (error.status === 404) {
        await pb.collection('videos').create({
          videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          thumbnailUrl: video.snippet.thumbnails.medium.url,
          playlistId,
        });
        console.log(`Vidéo ajoutée : ${video.snippet.title}`);
      } else {
        console.error('Erreur lors de la récupération de la vidéo :', error);
      }
    }
  }
}

// Exécuter la synchronisation
async function main() {
  await authenticateAdmin();
  await syncPlaylists();
  console.log('Playlists et vidéos YouTube synchronisées avec PocketBase.');
}

main().catch(console.error);
