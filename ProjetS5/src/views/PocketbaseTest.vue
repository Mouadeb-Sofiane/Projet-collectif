<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      isLoading: true,
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacez par l'URL de votre instance PocketBase
      // Récupérer les playlists depuis PocketBase
      this.playlists = await pb.collection('playlists').getFullList();
      
      // Récupérer les vidéos pour chaque playlist
      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `youtubePlaylistId="${playlist.id}"`,
        });
        this.$set(this.playlistsVideos, playlist.id, videos);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données depuis PocketBase:', error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<template>
  <div>
    <div v-if="isLoading">
      <h1>Chargement...</h1>
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
  </div>
</template>

<style>
/* Ajouter un style basique pour le rendu */
.playlists-container {
  display: flex;
  flex-wrap: wrap;
}

.playlist-block {
  margin: 20px;
  width: 300px;
}

.playlist-thumbnail img {
  width: 100%;
  height: auto;
}

.video-item {
  margin-bottom: 20px;
}

.video-image {
  width: 100%;
  height: auto;
}
</style>
