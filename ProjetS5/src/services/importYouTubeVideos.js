// importYouTubeVideos.js
import axios from 'axios';
import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

// Configuration de PocketBase et de l'API YouTube
const pb = new PocketBase(process.env.POCKETBASE_URL);
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

// Fonction pour authentifier en tant qu'administrateur
async function authenticateAdmin() {
  try {
    const authData = await pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);
    console.log('Authentification admin réussie.');
  } catch (error) {
    console.error('Erreur lors de l\'authentification admin :', error);
    process.exit(1); // Arrête le script en cas d'erreur
  }
}

// Récupère les playlists du canal YouTube
async function fetchYouTubePlaylists() {
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlists`, {
    params: {
      part: 'snippet',
      channelId: CHANNEL_ID,
      key: YOUTUBE_API_KEY,
      maxResults: 50,
    },
  });
  return response.data.items;
}

// Récupère les vidéos d’une playlist
async function fetchPlaylistVideos(playlistId) {
  const response = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
    params: {
      part: 'snippet,contentDetails',
      playlistId,
      key: YOUTUBE_API_KEY,
      maxResults: 50,
    },
  });
  return response.data.items;
}

// Vérifie et ajoute les playlists dans PocketBase
async function syncPlaylists() {
  const playlists = await fetchYouTubePlaylists();

  for (const playlist of playlists) {
    try {
      const existingPlaylist = await pb.collection('playlists').getFirstListItem(`playlistId="${playlist.id}"`);
      // Playlist existe déjà, pas besoin de la créer
    } catch (error) {
      if (error.status === 404) { // Playlist non trouvée, la créer
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

    // Synchronise les vidéos de chaque playlist
    await syncPlaylistVideos(playlist.id);
  }
}

// Vérifie et ajoute les vidéos dans PocketBase
async function syncPlaylistVideos(playlistId) {
  const videos = await fetchPlaylistVideos(playlistId);

  for (const video of videos) {
    const videoId = video.contentDetails.videoId;
    try {
      const existingVideo = await pb.collection('videos').getFirstListItem(`videoId="${videoId}"`);
      // Vidéo existe déjà, pas besoin de la créer
    } catch (error) {
      if (error.status === 404) { // Vidéo non trouvée, la créer
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
  console.log('YouTube playlists et vidéos synchronisées avec PocketBase.');
}

main().catch(console.error);

