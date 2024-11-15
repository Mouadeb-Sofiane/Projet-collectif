import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export const fetchPlaylists = async () => {
  try {
    const playlists = await pb.collection('playlists').getFullList(200, {
      sort: '-created',
    });
    console.log('Playlists récupérées:', playlists);
    return playlists;
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists:', error.response || error);
    return [];
  }
};

export const fetchVideos = async () => {
  try {
    const videos = await pb.collection('videos').getFullList(200, {
      sort: '-created',
    });
    return videos;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos :', error);
    return [];
  }
};

export const fetchAllVideos = async () => {
  try {
    const videos = await pb.collection('videos').getFullList(200, {
      sort: '-date',
    });
    console.log('Vidéos globales récupérées:', videos);
    return videos;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos globales:', error.response || error);
    return [];
  }
};

export const fetchVideosByPlaylist = async (playlistId) => {
  try {
    console.log(`Récupération des vidéos pour la playlist ${playlistId}...`);

    // Étape 1 : Récupérer les relations playlist_video
    const playlistVideoRelations = await pb.collection('playlist_video').getFullList(200, {
      filter: `id_playlists="${playlistId}"`,
    });

    console.log('Relations playlist_video récupérées:', playlistVideoRelations);

    // Étape 2 : Extraire les IDs des vidéos
    const videoIds = playlistVideoRelations.map(relation => relation.id_videos);

    if (videoIds.length === 0) {
      console.log(`Aucune vidéo trouvée pour la playlist ${playlistId}`);
      return [];
    }

    // Étape 3 : Récupérer les vidéos par leurs IDs
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

