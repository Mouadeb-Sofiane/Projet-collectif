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

      // Vérification et chargement des données en cache
      if (!this.cache.playlists || !this.cache.videos) {
        this.cache.playlists = await pb.collection('playlists').getFullList();
        this.cache.videos = await pb.collection('videos').getFullList(200);
      }

      this.playlists = [...this.cache.playlists];
      this.allVideos = [...this.cache.videos];

      // Récupération des vidéos par playlist
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

      // Préparation et démarrage du slider
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
    // Réinitialiser le slider
    this.sliderVideos = [];
    
    // Prioriser la vidéo en direct
    if (this.liveVideo) {
      this.sliderVideos.push({ type: 'youtube', data: this.liveVideo });
    } else {
      // Si aucune vidéo en direct, utiliser des vidéos locales
      const shuffledVideos = this.shuffleArray(this.allVideos);
      const additionalVideos = shuffledVideos.slice(0, 4);
      this.sliderVideos.push(
        ...additionalVideos.map((video) => ({ type: 'local', data: video }))
      );
    }
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
      const duration = 5000;
      const interval = 10;
      const step = 100 / (duration / interval);

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
      videoElement.currentTime = 1;

      return new Promise((resolve) => {
        videoElement.onseeked = () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL());
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
  </div>
</template>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
</style>