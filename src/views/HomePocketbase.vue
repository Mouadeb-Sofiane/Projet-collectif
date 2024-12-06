<script>
import PocketBase from 'pocketbase';
import {
  fetchYouTubeVideos,
  fetchYouTubePlaylists,
  fetchLiveStream,
} from '@/services/YoutubeServices';
import { RouterLink } from 'vue-router';

export default {
  data() {
    return {
      playlists: [], // Toutes les playlists (PocketBase + YouTube)
      playlistsVideos: {}, // Vidéos regroupées par playlist
      allVideos: [], // Toutes les vidéos de PocketBase
      liveVideo: null, // Vidéo en direct depuis YouTube
      randomVideo: null, // Vidéo aléatoire de PocketBase
      isLoading: true, // Indicateur de chargement
      errorMessage: '', // Gestion des erreurs
      status: '', // Statut actuel
    };
  },

  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      // Récupération des playlists et vidéos depuis PocketBase
      this.playlists = await pb.collection('playlists').getFullList();
      this.allVideos = await pb.collection('videos').getFullList(200);

      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      // Récupération des données YouTube
      const [ytPlaylists, ytVideos] = await Promise.all([
        fetchYouTubePlaylists(),
        fetchYouTubeVideos(),
      ]);

      this.playlists = [...this.playlists, ...ytPlaylists];
      this.playlistsVideos['yt'] = ytVideos;

      // Récupération du live YouTube
      this.liveVideo = await fetchLiveStream();
      this.status = this.liveVideo ? 'EN DIRECT' : 'EMISSION';

      // Sélectionner une vidéo aléatoire si aucune vidéo en direct
      if (!this.liveVideo && this.allVideos.length > 0) {
        this.randomVideo = this.getRandomVideo();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.errorMessage = 'Une erreur est survenue lors du chargement des données.';
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    getRandomVideo() {
      const randomIndex = Math.floor(Math.random() * this.allVideos.length);
      return this.allVideos[randomIndex];
    },
  },
};

</script>

<template>
  <div class="bg-black text-white">
  <!-- Chargement en cours -->
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
  </div>

  <!-- Affichage des erreurs -->
  <div v-if="errorMessage" class="text-center text-red-500">
    <p>{{ errorMessage }}</p>
  </div>

  <!-- Vidéo en direct ou vidéo aléatoire -->
  <div v-if="liveVideo || randomVideo" class="featured-video mb-12">
    <div class="relative w-full h-screen overflow-hidden">
      <!-- Vidéo YouTube -->
      <iframe
        v-if="liveVideo && liveVideo.id && liveVideo.id.videoId"
        :src="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${liveVideo.id.videoId}`"
        class="w-full h-full object-cover"
        frameborder="0"
        allow="autoplay; encrypted-media"
      ></iframe>

      <!-- Vidéo locale -->
      <video
        v-if="randomVideo && randomVideo.id && randomVideo.VideoTele"
        :src="`http://127.0.0.1:8090/api/files/videos/${randomVideo.id}/${randomVideo.VideoTele}`"
        class="w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
      ></video>

      <!-- Dégradés -->
      <div 
        class="absolute inset-x-0 bottom-0"
        style="background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); height: 50%;"
      ></div>

       <!-- Dégradé sur la gauche (uniquement pour desktop >= 768px) -->
    <div 
      class="hidden md:block absolute inset-y-0 left-0"
      style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); width: 50%;"
    ></div>

      <!-- Contenu textuel -->
      <div
        class="absolute  inset-0 flex flex-col justify-end items-center text-center md:text-start p-6 text-white md:justify-center md:items-start md:p-12"
      >
        <h1 class="text-xl font-[400] mb-[1rem] md:text-sm md:mb-12 tracking-[0.5em]">{{ status }}</h1>
        <h1 class="text-xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase">
          {{ randomVideo ? randomVideo.title : liveVideo.snippet.title }}
        </h1>
        <p class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
        {{ randomVideo 
          ? (randomVideo.description.length > 70 
            ? randomVideo.description.slice(0, 70) + '...' 
            : randomVideo.description) 
          : (liveVideo.snippet.description.length > 70 
            ? liveVideo.snippet.description.slice(0, 70) + '...' 
            : liveVideo.snippet.description) }}
        </p>
      
      <!-- Bouton d'action -->
      <div>
      <button
        v-if="liveVideo && liveVideo.id && liveVideo.id.videoId"
        :href="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${liveVideo.id.videoId}`"
        class="bg-white hover:bg-gray-300 text-rouges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
      >
        VOIR LE DIRECT
      </button>
      <RouterLink
        v-else-if="randomVideo && randomVideo.id"
        :to="{ name: 'singleVideoPocket', params: { id: randomVideo.id } }"
        class="bg-white hover:bg-gray-300 text-oranges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
      >
        LECTURE
      </RouterLink>
      </div>
    </div>
  </div>

    <!-- Section Playlists et vidéos PocketBase -->
    <!-- Playlists et vidéos -->
    <div v-if="playlists.length && !isLoading" class="playlists text-black">
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist bg-white p-4 rounded-lg shadow-md"
        >
          <h3 class="text-lg font-bold text-center">{{ playlist.title }}</h3>
          <div v-if="playlistsVideos[playlist.id]?.length">
            <div v-for="video in playlistsVideos[playlist.id]" :key="video.id" class="video-item">
              <h3>{{ video.title }}</h3>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <img :src="video.thumbnailUrl" alt="Thumbnail" class="w-full rounded-md" />
              </router-link>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
              <button class="w-full mt-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                Regarder
              </button>
              </router-link>
            </div>
          </div>
          <p v-else class="text-center text-gray-500">Aucune vidéo disponible.</p>
        </div>
      </div>
    </div>
  </div>
  </div>

</template>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
</style>