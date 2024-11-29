import PocketBase from 'pocketbase';

// Fonction pour récupérer les playlists de YouTube
const fetchYouTubePlaylists = async (apiKey, channelId) => {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.items; // Liste des playlists
};

// Fonction pour récupérer les vidéos d'une playlist YouTube
const fetchYouTubePlaylistVideos = async (apiKey, playlistId) => {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${apiKey}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return data.items; // Liste des vidéos
};

// Fonction pour enregistrer une playlist dans PocketBase
const savePlaylistToPocketBase = async (playlist) => {
  const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacer par l'URL de votre instance PocketBase
  const data = {
    title: playlist.snippet.title,
    description: playlist.snippet.description,
    youtubePlaylistId: playlist.id, // L'ID de la playlist YouTube
    thumbnailUrl: playlist.snippet.thumbnails.default.url,
  };

  try {
    const savedPlaylist = await pb.collection('playlists').create(data);
    return savedPlaylist;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la playlist:', error);
  }
};

// Fonction pour enregistrer une vidéo dans PocketBase
const saveVideoToPocketBase = async (video, playlistId) => {
  const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacer par l'URL de votre instance PocketBase
  const data = {
    title: video.snippet.title,
    description: video.snippet.description,
    youtubeVideoId: video.snippet.resourceId.videoId, // L'ID de la vidéo YouTube
    youtubePlaylistId: playlistId, // L'ID de la playlist associée
    thumbnailUrl: video.snippet.thumbnails.default.url,
  };

  try {
    const savedVideo = await pb.collection('videos').create(data);
    return savedVideo;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la vidéo:', error);
  }
};

// Fonction principale pour récupérer les playlists et vidéos et les enregistrer dans PocketBase
const fetchAndSaveYouTubeData = async (apiKey, channelId) => {
  try {
    // Récupérer les playlists de YouTube
    const playlists = await fetchYouTubePlaylists(apiKey, channelId);

    // Pour chaque playlist, récupérer les vidéos et enregistrer les deux dans PocketBase
    for (const playlist of playlists) {
      const savedPlaylist = await savePlaylistToPocketBase(playlist);

      // Récupérer les vidéos de cette playlist
      const videos = await fetchYouTubePlaylistVideos(apiKey, playlist.id);
      for (const video of videos) {
        await saveVideoToPocketBase(video, savedPlaylist.id);
      }
    }

    console.log('Données YouTube enregistrées avec succès dans PocketBase!');
  } catch (error) {
    console.error('Erreur lors de la récupération ou de l\'enregistrement des données:', error);
  }
};


// Appeler la fonction avec votre clé API et l'ID de la chaîne YouTube
const apiKey = 'AIzaSyDX8BB6-H6riZiT1xDPI3juzwWRJ1bRkv8';
const channelId = 'UCPDz0ioYdfy3IhrY26DUPrQ';


fetchAndSaveYouTubeData(apiKey, channelId);
