import axios from 'axios';
import pb from '@/pocketbase';

const API_KEY = 'AIzaSyDCwurTmP-By20Lfyt-0sqit9gCTiMfuYY';
const CHANNEL_ID = 'UCPDz0ioYdfy3IhrY26DUPrQ';

// Fonction générique pour sauvegarder des données dans PocketBase
const saveToPocketBase = async (collection, filterKey, filterValue, data) => {
  try {
    const existingItem = await pb.collection(collection).getFirstListItem(`${filterKey}="${filterValue}"`);
    if (!existingItem) {
      await pb.collection(collection).create(data);
    }
  } catch (error) {
    if (error.status === 404) {
      // Si l'élément n'existe pas, créez-le
      await pb.collection(collection).create(data);
    } else {
      console.error(`Erreur lors de la sauvegarde dans ${collection}:`, error);
    }
  }
};

// Récupérer les vidéos de la chaîne et les sauvegarder dans PocketBase
export const fetchYouTubeVideos = async () => {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;

  try {
    const response = await axios.get(url);
    const videos = response.data.items;

    for (const video of videos) {
      if (video.id.kind === 'youtube#video') {
        await saveToPocketBase('videos', 'videoId', video.id.videoId, {
          videoId: video.id.videoId,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.medium.url,
          publishDate: video.snippet.publishedAt,
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
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=10&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const videos = response.data.items;

    for (const video of videos) {
      await saveToPocketBase('videos', 'videoId', video.contentDetails.videoId, {
        videoId: video.contentDetails.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.medium.url,
        publishDate: video.contentDetails.videoPublishedAt,
      });
    }
    return videos;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos de la playlist:', error);
    return [];
  }
};

// Récupérer les playlists de la chaîne et les sauvegarder dans PocketBase
export const fetchYouTubePlaylists = async () => {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${CHANNEL_ID}&maxResults=10&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const playlists = response.data.items;

    for (const playlist of playlists) {
      await saveToPocketBase('playlists', 'playlistId', playlist.id, {
        playlistId: playlist.id,
        title: playlist.snippet.title,
        thumbnail: playlist.snippet.thumbnails.medium.url,
      });
    }
    return playlists;
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists:', error);
    return [];
  }
};

// Récupérer les informations sur le live en cours
export const fetchLiveStream = async () => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const liveItems = response.data.items;
    return liveItems.length > 0 ? liveItems[0] : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du live:', error);
    return null;
  }
};