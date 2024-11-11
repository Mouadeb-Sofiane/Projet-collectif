<script>
import { fetchPlaylists, fetchVideosByPlaylist } from '@/services/PocketBaseServices';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {}, // Structure pour garder les vidéos par playlist
      isLoading: true, // Indicateur global de chargement
      error: null, // Message d'erreur global
    };
  },
  async mounted() {
    try {
      this.playlists = await fetchPlaylists();
      console.log('Playlists:', this.playlists);

      // Récupérer les vidéos pour chaque playlist
      const fetchVideosPromises = this.playlists.map(async (playlist) => {
        try {
          const videos = await fetchVideosByPlaylist(playlist.id);
          this.playlistsVideos[playlist.id] = videos;
          console.log(`Vidéos pour la playlist ${playlist.title}:`, videos);
        } catch (error) {
          console.error(`Erreur lors de la récupération des vidéos pour ${playlist.title}:`, error);
          this.$set(this.playlistsVideos, playlist.id, []); // Ajouter une valeur vide pour cette playlist en cas d'erreur
        }
      });

      // Attendre que toutes les vidéos soient récupérées
      await Promise.all(fetchVideosPromises);

    } catch (error) {
      console.error('Erreur lors de la récupération des playlists:', error);
      this.error = 'Une erreur est survenue lors du chargement des playlists et des vidéos.';
    } finally {
      this.isLoading = false;
    }
  }
};
</script>

<template>
  <div v-if="isLoading">
    <h1>Chargement...</h1>
  </div>
  <div v-if="error" class="error-message">
    <p>`{{ error }}`</p>
  </div>

  <div v-if="playlists.length && !isLoading">
    <h2>Mes Playlists</h2>
    <div class="playlists-container">
      <div v-for="(playlist, index) in playlists" :key="index" class="playlist-block">
        <div class="playlist-thumbnail">
          <img :src="playlist.thumbnailUrl" :alt="playlist.title" />
          <h3>{{ playlist.title }}</h3>
          <img :src="playlist.thumbnailUrl" :alt="playlist.title" />
        </div>

        <!-- Vérifier si des vidéos existent pour cette playlist -->
        <div v-if="playlistsVideos[playlist.id] && playlistsVideos[playlist.id].length">
          <div v-for="(video, index) in playlistsVideos[playlist.id]" :key="index" class="video-item">
            <h4>{{ video.title }}</h4>
            <router-link :to="{ name: 'singleVideo', params: { id: video.videoId } }">
              <img :src="video.thumbnailUrl" :alt="video.title" class="video-image" />
            </router-link>
            <router-link :to="{ name: 'singleVideo', params: { id: video.videoId } }">
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
</template>

<style scoped>
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
</style>
