// services/PocketBaseServices.js
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacez par votre URL PocketBase

// Fonction pour récupérer toutes les playlists
export const fetchPlaylists = async () => {
  try {
    const playlists = await pb.collection('playlists').getFullList(200, {
      sort: '-created', // Optionnel : tri décroissant par date de création
    });
    return playlists;
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists :', error);
    return [];
  }
};

// Fonction pour récupérer les vidéos d'une playlist
export const fetchVideosByPlaylist = async (playlistId) => {
  try {
    const videos = await pb.collection('videos').getFullList(200, {
      filter: `playlistId="${playlistId}"`,
      sort: '-publishedAt', // Optionnel : tri décroissant par date de publication
    });
    return videos;
  } catch (error) {
    console.error(`Erreur lors de la récupération des vidéos pour la playlist ${playlistId} :`, error);
    return [];
  }
};

