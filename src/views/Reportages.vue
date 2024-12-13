<script setup lang="ts">
import HomePlaylist from '@/components/HomePlaylist.vue';
import HomeSlider from '@/components/HomeSlider.vue';


</script>

<template>
    <h1>Reportages</h1>
    <HomeSlider />
    <HomePlaylist />
    <script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      playlists: [], // Stocke les vidéos regroupées par playlists
      visibleItems: 4, // Par défaut, pour desktop
    };
  },
  async created() {
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');
      // Récupère toutes les vidéos
      const videos = await pb.collection('videos').getFullList({
        sort: '-created',
        expand: 'playlist', // Suppose que chaque vidéo a une playlist liée
      });

      // Groupe les vidéos par playlist
      const playlistsMap = {};
      videos.forEach((video) => {
        const playlistName = video.expand?.playlist?.name || 'Sans Playlist';
        if (!playlistsMap[playlistName]) {
          playlistsMap[playlistName] = [];
        }
        playlistsMap[playlistName].push({
          id: video.id,
          title: video.title,
          videoId: video.videoId,
          duration: video.duration,
          thumbnail: video.thumbnail_url,
        });
      });

      // Transforme l'objet en tableau pour utilisation dans Vue
      this.playlists = Object.keys(playlistsMap).map((name) => ({
        name,
        videos: playlistsMap[name],
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos :', error);
    }
  },
  methods: {
    formatDuration(duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m${seconds < 10 ? '0' : ''}${seconds}`;
    },
  },
};
</script>

<template>
  <div class="playlists-container bg-black text-white p-6">
    <h2 class="text-3xl font-bold text-center mb-8">Nos Playlists</h2>
    <div v-for="(playlist, index) in playlists" :key="index" class="playlist-section mb-10">
      <!-- Titre de la playlist -->
      <h3 class="text-2xl font-bold mb-4">{{ playlist.name }}</h3>

      <!-- Carrousel des vidéos -->
      <div class="carousel-container relative overflow-hidden">
        <div class="flex transition-transform duration-700 ease-in-out w-full">
          <div
            v-for="(video, index) in playlist.videos"
            :key="video.id"
            class="carousel-item flex-shrink-0 w-full px-2"
          >
            <div class="rounded-lg shadow-md">
              <div class="relative">
                <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                  <img
                    :src="video.thumbnail"
                    alt="Vignette de la vidéo"
                    class="w-full h-40 object-cover rounded-t-lg"
                  />
                </router-link>
                <div v-if="video.duration" class="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded absolute bottom-2 right-2">
                  {{ formatDuration(video.duration) }}
                </div>
              </div>
              <div class="p-4">
                <h4 class="text-sm font-bold truncate">{{ video.title }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  width: 100%;
  overflow-x: scroll;
}
.carousel-item {
  min-width: calc(25% - 1rem); /* Ajuste pour afficher 4 vidéos */
}
</style>

</template>