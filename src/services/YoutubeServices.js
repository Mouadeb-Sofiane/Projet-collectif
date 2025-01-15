import axios from 'axios';

const API_KEY = 'AIzaSyDeiI-SizslP9iwTeECrgrOxTtiniepXRg'; // Remplace par ta clé API
const CHANNEL_ID = 'UCPDz0ioYdfy3IhrY26DUPrQ'; // Remplace par l'ID de ta chaîne


// Récupérer les vidéos de la chaîne
export const fetchYouTubeVideos = async () => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`; // Utilisation de backticks
  try {
    const response = await axios.get(url);
    return response.data.items;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos', error);
    return [];
  }
};

// Récupérer les vidéos d'une playlist
export const fetchPlaylistVideos = async (playlistId) => {
  const API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${API_KEY}`; // Utilisation de backticks

  try {
    const response = await axios.get(API_URL);
    return response.data.items;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos de la playlist:', error);
    return [];
  }
};

// Récupérer les playlists de la chaîne
export const fetchYouTubePlaylists = async () => {
  const API_URL = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&key=${API_KEY}`; // Utilisation de backticks

  try {
    const response = await axios.get(API_URL);
    return response.data.items;
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists:', error);
    return [];
  }
};

// Récupérer les informations sur le live en cours
export const fetchLiveStream = async () => {
  const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`; // Utilisation de backticks

  try {
    const response = await axios.get(API_URL);
    const liveItems = response.data.items;
    if (liveItems.length > 0) {
      return liveItems[0]; // Retourne la première vidéo en live
    }
    return null; // Pas de live en cours
  } catch (error) {
    console.error('Erreur lors de la récupération du live:', error);
    return null;
  }
};


/* import axios from 'axios';
import pb from '@/pocketbase';

const API_KEY = 'AIzaSyDX8BB6-H6riZiT1xDPI3juzwWRJ1bRkv8'; // Remplacez par votre clé API
const CHANNEL_ID = 'UCPDz0ioYdfy3IhrY26DUPrQ'; // Remplacez par l'ID de votre chaîne

// Récupérer les vidéos de la chaîne et les sauvegarder dans PocketBase
export const fetchYouTubeVideos = async () => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
  try {
    const response = await axios.get(url);
    const videos = response.data.items;

    // Sauvegarde des vidéos dans PocketBase en évitant les doublons
    for (const video of videos) {
      const existingVideo = await pb.collection('videos').getFirstListItem(`videoId="${video.id.videoId}"`);
      if (!existingVideo) {
        await pb.collection('videos').create({
          videoId: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium.url,
          publishDate: video.snippet.publishedAt, // date de publication
        });
      }
    }
    return videos;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    return [];
  }
};

// Récupérer les vidéos d'une playlist et les sauvegarder dans PocketBase
export const fetchPlaylistVideos = async (playlistId) => {
  const API_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=10&key=${API_KEY}`;
  try {
    const response = await axios.get(API_URL);
    const videos = response.data.items;

    // Sauvegarde des vidéos de la playlist dans PocketBase
    for (const video of videos) {
      const existingVideo = await pb.collection('videos').getFirstListItem(`videoId="${video.contentDetails.videoId}"`);
      if (!existingVideo) {
        await pb.collection('videos').create({
          videoId: video.contentDetails.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium.url,
          publishDate: video.contentDetails.videoPublishedAt, // date de publication
        });
      }
    }
    return videos;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos de la playlist:', error);
    return [];
  }
};

// Récupérer les playlists de la chaîne et les sauvegarder dans PocketBase
export const fetchYouTubePlaylists = async () => {
  const API_URL = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&key=${API_KEY}`;
  try {
    const response = await axios.get(API_URL);
    const playlists = response.data.items;

    // Sauvegarde des playlists dans PocketBase en évitant les doublons
    for (const playlist of playlists) {
      const existingPlaylist = await pb.collection('playlists').getFirstListItem(`playlistId="${playlist.id}"`);
      if (!existingPlaylist) {
        await pb.collection('playlists').create({
          playlistId: playlist.id,
          title: playlist.snippet.title,
          thumbnail: playlist.snippet.thumbnails.medium.url,
        });
      }
    }
    return playlists;
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists:', error);
    return [];
  }
};

// Récupérer les informations sur le live en cours
export const fetchLiveStream = async () => {
  const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;
  try {
    const response = await axios.get(API_URL);
    const liveItems = response.data.items;
    if (liveItems.length > 0) {
      return liveItems[0]; // Retourne la première vidéo en live
    }
    return null; // Pas de live en cours
  } catch (error) {
    console.error('Erreur lors de la récupération du live:', error);
    return null;
  }
};
*/ 