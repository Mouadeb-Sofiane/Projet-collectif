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

// Fonction pour récupérer les vidéos d'une playlist spécifique
export const fetchVideosByPlaylist = async (playlistId) => {
  try {
    // Vérifier le champ 'id_playlists' dans PocketBase et s'assurer qu'il correspond à votre relation
    const playlistVideos = await pb.collection('playlist_video').getFullList(200, {
      filter: `id_playlists="${playlistId}"`, // Assurez-vous que ce champ existe
    });

    console.log('Données de playlist_video:', playlistVideos);

    // Récupérer les IDs des vidéos associées
    const videoIds = playlistVideos.map(entry => entry.id_videos);
    console.log('ID des vidéos récupérés:', videoIds);

    if (videoIds.length === 0) {
      console.log(`Aucune vidéo trouvée pour la playlist ${playlistId}`);
      return [];
    }

    // Récupérer les vidéos
    const videos = await pb.collection('videos').getFullList(200, {
      filter: `id IN (${videoIds.join(',')})`, // Vérifier si la syntaxe 'id IN' est valide
      sort: '-publishedAt', // Trier par date de publication si nécessaire
    });

    console.log('Vidéos récupérées:', videos);
    return videos;
  } catch (error) {
    console.error(`Erreur lors de la récupération des vidéos pour la playlist ${playlistId} :`, error);
    return [];
  }
};
