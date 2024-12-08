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
      playlists: [],
      playlistsVideos: {},
      allVideos: [],
      liveVideo: null,
      sliderVideos: [],
      currentVideoIndex: 0,
      sliderInterval: null,
      progressInterval: null,
      progressPercentage: 0,
      isLoading: true,
      errorMessage: '',
      status: '',
    };
  },

  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      // Chargement des playlists et vidéos locales
      this.playlists = await pb.collection('playlists').getFullList();
      this.allVideos = await pb.collection('videos').getFullList(200);

      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      // Chargement des données YouTube
      const [ytPlaylists, ytVideos] = await Promise.all([
        fetchYouTubePlaylists(),
        fetchYouTubeVideos(),
      ]);

      // Fusion des playlists locales et YouTube
      this.playlists = [...this.playlists, ...ytPlaylists];
      this.playlistsVideos['yt'] = ytVideos;

      // Chargement de la vidéo en direct
      this.liveVideo = await fetchLiveStream();
      this.status = this.liveVideo ? 'EN DIRECT' : 'ÉMISSION';

      // Préparation des vidéos pour le slider
      this.prepareSliderVideos();
      this.startSlider();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.errorMessage = 'Une erreur est survenue lors du chargement des données.';
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    prepareSliderVideos() {
      this.sliderVideos = [];
      if (this.liveVideo) {
        this.sliderVideos.push({ type: 'youtube', data: this.liveVideo });
      }
      const shuffledVideos = this.shuffleArray(this.allVideos);
      const additionalVideos = shuffledVideos.slice(0, 4);
      this.sliderVideos.push(
        ...additionalVideos.map((video) => ({ type: 'local', data: video }))
      );
    },

    startSlider() {
      if (this.sliderVideos.length > 0) {
        this.startProgressBar();
        this.sliderInterval = setInterval(() => {
          this.nextSlide();
        }, 5000);
      }
    },

    nextSlide() {
      this.currentVideoIndex = (this.currentVideoIndex + 1) % this.sliderVideos.length;
      this.resetProgressBar();
    },

    startProgressBar() {
      const duration = 5000; // Durée totale (5 secondes)
      const interval = 10; // Mise à jour tous les 16 ms (environ 60 FPS)
      const step = 100 / (duration / interval); // Calcul de l'incrément

      this.progressPercentage = 0;

      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }

      this.progressInterval = setInterval(() => {
        this.progressPercentage += step;

        if (this.progressPercentage >= 100) {
          clearInterval(this.progressInterval);
          this.nextSlide();
        }
      }, interval);
    },

    resetProgressBar() {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
      this.startProgressBar();
    },

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    beforeUnmount() {
      if (this.sliderInterval) {
        clearInterval(this.sliderInterval);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
    },
  },
};
</script>



<template>
  <div class="bg-black text-white relative">
    <!-- Chargement en cours -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Slider de vidéos -->
    <div v-if="sliderVideos.length && !isLoading" class="relative h-screen w-full">
      <div class="absolute inset-0">
        <div 
          v-for="(video, index) in sliderVideos" 
          :key="index" 
          class="absolute inset-0 transition-opacity duration-500"
          :class="{ 'opacity-100': index === currentVideoIndex, 'opacity-0': index !== currentVideoIndex }"
        >
          <!-- Vidéo YouTube -->
          <iframe
            v-if="video.type === 'youtube' && video.data.id && video.data.id.videoId"
            :src="`https://www.youtube.com/embed/${video.data.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${video.data.id.videoId}`"
            class="w-full h-full object-cover"
            frameborder="0"
            allow="autoplay; encrypted-media"
          ></iframe>

          <!-- Vidéo locale -->
          <video
            v-if="video.type === 'local' && video.data.id && video.data.VideoTele"
            :src="`http://127.0.0.1:8090/api/files/videos/${video.data.id}/${video.data.VideoTele}`"
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

          <div 
            class="hidden md:block absolute inset-y-0 left-0"
            style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); width: 50%;"
          ></div>

          <!-- Contenu textuel -->
          <div
            class="absolute inset-0 flex flex-col justify-end items-center text-center md:text-start p-6 text-white md:justify-center md:items-start md:p-12"
          >
            <h1 class="text-sm font-[400] mb-[1rem] md:text-sm md:mb-12 tracking-[0.5em]">
              {{ video.type === 'youtube' ? 'EN DIRECT' : 'ÉMISSION' }}
            </h1>
            <h1 class="text-5xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase">
              {{ 
                video.type === 'youtube' 
                ? video.data.snippet.title 
                : video.data.title 
              }}
            </h1>
            <p class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
              {{ 
                video.type === 'youtube' 
                ? (video.data.snippet.description.length > 70 
                  ? video.data.snippet.description.slice(0, 70) + '...' 
                  : video.data.snippet.description)
                : (video.data.description.length > 70 
                  ? video.data.description.slice(0, 70) + '...' 
                  : video.data.description)
              }}
            </p>
          
            <!-- Boutons d'action -->
            <div class="mb-10">
              <a
                v-if="video.type === 'youtube'"
                :href="`https://www.youtube.com/embed/${video.data.id.videoId}?autoplay=1`"
                target="_blank"
                class="bg-white hover:bg-gray-300 text-rouges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
              >
                VOIR LE DIRECT
              </a>
              
              <RouterLink
                v-else
                :to="{ name: 'singleVideoPocket2', params: { id: video.data.id } }"
                class="bg-white hover:bg-gray-300 text-oranges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
              >
                LECTURE
              </RouterLink>

              <RouterLink
                v-if="video.type === 'local'"
                :to="{ name: 'singleVideoPocket', params: { id: video.data.id } }"
                class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all ml-8"
              >
                PLUS D'INFO
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Dots -->
<div class="absolute bottom-4 md:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
  <div 
    v-for="(video, index) in sliderVideos" 
    :key="index" 
    @click="goToSlide(index)"
    class="w-5 h-5 relative cursor-pointer"
  >
    <!-- Cercle externe -->
    <div 
      class="absolute inset-0 rounded-full bg-white/30"
    ></div>

    <!-- Progression du cercle interne -->
    <div 
      v-if="index === currentVideoIndex" 
      class="absolute inset-0 overflow-hidden rounded-full"
    >
      <div 
        class="absolute top-0 left-0 h-full bg-white transition-all ease-linear"
        :style="{ width: `${progressPercentage}%` }"
      ></div>
    </div>
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
  
</template>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
</style>