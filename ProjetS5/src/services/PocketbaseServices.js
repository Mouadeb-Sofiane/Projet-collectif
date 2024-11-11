import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const fetchPlaylists = async () => {
  try {
    const playlists = await pb.collection('playlists').getFullList(200, {
      sort: '-created',
    });
    return playlists;
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists :', error);
    return [];
  }
};

export const fetchVideosByPlaylist = async (playlistId) => {
  try {
    // Vérifier la validité de playlistId
    console.log('playlistId:', playlistId);
    if (!playlistId) {
      console.error('playlistId est invalide ou non défini');
      return [];
    }

    console.log(`Récupération des vidéos pour la playlist ${playlistId}...`);

    // Essayez sans filtre pour tester la validité des données
    const playlistVideos = await pb.collection('playlist_video').getFullList(200, {
      filter: `playlists_id="${playlistId}"`,  // Vérifiez que le nom du champ est correct
    });

    console.log('Données de playlist_video récupérées:', playlistVideos);

    // Récupérer les IDs des vidéos liées à la playlist
    const videoIds = playlistVideos.map(entry => entry.videos_id);
    console.log('ID des vidéos récupérés:', videoIds);

    // Vérification si des vidéos ont été récupérées
    if (videoIds.length === 0) {
      console.log(`Aucune vidéo trouvée pour la playlist ${playlistId}`);
      return [];
    }

    // Filtrer les vidéos par leurs IDs récupérés
    const videos = await pb.collection('videos').getFullList(200, {
      filter: `id IN (${videoIds.map(id => `"${id}"`).join(',')})`,
      sort: '-date',
    });

    console.log('Vidéos récupérées:', videos);
    return videos;
  } catch (error) {
    console.error(`Erreur lors de la récupération des vidéos pour la playlist ${playlistId}:`, error.response || error);
    return [];
  }
};
