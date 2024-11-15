<script>
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      allVideos: [],
      isLoading: true,
      error: null,
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      // Récupérer les playlists
      this.playlists = await fetchPlaylists();
      console.log('Playlists récupérées:', this.playlists);

      // Récupérer toutes les vidéos globales
      this.allVideos = await fetchAllVideos();
      console.log('Vidéos globales récupérées:', this.allVideos);

      // Récupérer les vidéos par playlist
      for (const playlist of this.playlists) {
        const videos = await fetchVideosByPlaylist(playlist.id);
        this.$set(this.playlistsVideos, playlist.id, videos);
      }
    } catch (error) {
      this.error = 'Une erreur s\'est produite lors du chargement des données.';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  },
};

export const fetchPlaylists = async () => {
  try {
    const playlists = await pb.collection('playlists').getFullList(200, {
      sort: '-created',
    });
    return playlists;
  } catch (error) {
    console.error('Erreur lors de la récupération des playlists:', error.response || error);
    return [];
  }
};

export const fetchAllVideos = async () => {
  try {
    const videos = await pb.collection('videos').getFullList(200, {
      sort: '-date',
    });
    return videos;
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos globales:', error.response || error);
    return [];
  }
};

export const fetchVideosByPlaylist = async (playlistId) => {
  try {
    const playlistVideoRelations = await pb.collection('playlist_video').getFullList(200, {
      filter: `id_playlists="${playlistId}"`,
    });

    const videoIds = playlistVideoRelations.map(relation => relation.id_videos);

    if (videoIds.length === 0) {
      console.log(`Aucune vidéo trouvée pour la playlist ${playlistId}`);
      return [];
    }

    const videos = await pb.collection('videos').getFullList(200, {
      filter: `id IN (${videoIds.map(id => `"${id}"`).join(',')})`,
      sort: '-date',
    });

    return videos;
  } catch (error) {
    console.error(`Erreur lors de la récupération des vidéos pour la playlist ${playlistId}:`, error.response || error);
    return [];
  }
};
</script>

<template>
  <div>
    <div v-if="isLoading">
      <h1>Chargement...</h1>
    </div>
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-if="playlists.length && !isLoading">
      <h2>Mes Playlists</h2>
      <div class="playlists-container">
        <div v-for="playlist in playlists" :key="playlist.id" class="playlist-block">
          <div class="playlist-thumbnail">
            <img :src="playlist.thumbnailUrl" :alt="playlist.title" />
            <h3>{{ playlist.title }}</h3>
          </div>

          <div v-if="playlistsVideos[playlist.id]?.length">
            <div v-for="video in playlistsVideos[playlist.id]" :key="video.id" class="video-item">
              <h4>{{ video.title }}</h4>
              <p>{{ video.description }}</p>
              <p>Date de publication : {{ video.publishedAt }}</p>
              <router-link :to="{ name: 'singleVideo', params: { id: video.id } }">
                <img :src="video.thumbnailUrl" :alt="video.title" class="video-image" />
                <button>Regarder</button>
              </router-link>
            </div>
          </div>
          <div v-else>
            <p>Aucune vidéo disponible pour cette playlist.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="allVideos.length">
      <h2>Toutes les Vidéos</h2>
      <div class="videos-container">
        <div v-for="video in allVideos" :key="video.id" class="video-item">
          <h4>{{ video.title }}</h4>
          <p>{{ video.description }}</p>
          <p>{{ video.date }}</p>
          <p>{{ video.duree }}</p>
          <img :src="video.miniature" />
          <router-link :to="{ name: 'singleVideo', params: { id: video.id } }">
            <img :src="video.thumbnailUrl" :alt="video.title" class="video-image" />
            <button>Regarder</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.playlists-container {
  padding: 0 5%;
}

.playlist-block {
  margin-bottom: 40px;
}

.playlist-thumbnail {
  text-align: center;
}

.video-item {
  margin-bottom: 15px;
  text-align: center;
}

.video-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.error-message {
  color: red;
  font-size: 1.2em;
  margin-top: 20px;
}

.videos-container {
  padding: 0 5%;
  margin-top: 40px;
}
</style>
