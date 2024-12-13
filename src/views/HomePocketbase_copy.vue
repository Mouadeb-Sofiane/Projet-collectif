<script>
import PocketBase from 'pocketbase';
import { fetchYouTubeVideos, fetchYouTubePlaylists, fetchLiveStream } from '@/services/YoutubeServices';
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
      cache: {
        playlists: null,
        videos: null,
        lastYouTubeFetch: 0,
      },
    };
  },

  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      // Vérification du cache local pour PocketBase
      if (!this.cache.playlists || !this.cache.videos) {
        this.cache.playlists = await pb.collection('playlists').getFullList();
        this.cache.videos = await pb.collection('videos').getFullList(200);
      }

      this.playlists = [...this.cache.playlists];
      this.allVideos = [...this.cache.videos];

      // Récupération des vidéos pour chaque playlist
      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      // Limitation des requêtes API YouTube
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;
      if (now - this.cache.lastYouTubeFetch > fifteenMinutes) {
        const [ytPlaylists, ytVideos] = await Promise.all([
          fetchYouTubePlaylists(),
          fetchYouTubeVideos(),
        ]);
        this.cache.lastYouTubeFetch = now;

        this.playlists = [...this.playlists, ...ytPlaylists];
        this.playlistsVideos['yt'] = ytVideos;
      }

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

    goToSlide(index) {
      this.currentVideoIndex = index;
      this.resetProgressBar();
    },

    captureThumbnail(videoUrl) {
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.currentTime = 1; // Capturer une image à 1 seconde
      return new Promise((resolve) => {
        videoElement.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL()); // Retourne l'image sous forme de base64
        };
      });
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

    <!-- Vidéo en direct YouTube -->
    <div v-if="liveVideo && !isLoading" class="relative h-screen w-full">
      <iframe
        v-if="liveVideo.id && liveVideo.id"
        :src="`https://www.youtube.com/embed/${liveVideo.id}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${liveVideo.id}`"
        class="w-full h-full object-cover"
        frameborder="0"
        allow="autoplay; encrypted-media"
      ></iframe>

      <!-- Dégradé pour la vidéo -->
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
          EN DIRECT
        </h1>
        <h1 class="text-5xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase">
          {{ liveVideo.snippet.title }}
        </h1>
        <p class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
          {{ liveVideo.snippet.description.length > 70 ? liveVideo.snippet.description.slice(0, 70) + '...' : liveVideo.snippet.description }}
        </p>

        <!-- Bouton d'action -->
        <div class="mb-10">
          <a
            :href="`https://www.youtube.com/embed/${liveVideo.id}?autoplay=1`"
            target="_blank"
            class="bg-white hover:bg-gray-300 text-rouges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
          >
            VOIR LE DIRECT
          </a>
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