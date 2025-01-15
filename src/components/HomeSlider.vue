<script>
import PocketBase from 'pocketbase';
import { RouterLink } from 'vue-router';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      allVideos: [],
      sliderVideos: [],
      currentVideoIndex: 0,
      sliderInterval: null,
      progressInterval: null,
      progressPercentage: 0,
      isLoading: true,
      errorMessage: '',
      cache: {
        playlists: null,
        videos: null,
      },
    };
  },

  async mounted() {
    this.isLoading = true;

    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      if (!this.cache.playlists || !this.cache.videos) {
        this.cache.playlists = await pb.collection('playlists').getFullList();
        this.cache.videos = await pb.collection('videos').getFullList(200);
      }

      this.playlists = [...this.cache.playlists];
      this.allVideos = [...this.cache.videos];

      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      await this.prepareSliderVideos();
      this.startSlider();
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.errorMessage = 'Une erreur est survenue lors du chargement des données.';
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    shuffleArray(array) {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    },

    async prepareSliderVideos() {
      this.sliderVideos = [];
      this.currentVideoIndex = 0;

      const localVideos = this.shuffleArray(this.allVideos)
        .slice(0, 4)
        .map(video => ({ type: 'local', data: video }));

      this.sliderVideos = [...localVideos];

      while (this.sliderVideos.length < 4) {
        const remainingVideos = this.shuffleArray(this.allVideos)
          .slice(0, 4 - this.sliderVideos.length)
          .map(video => ({ type: 'local', data: video }));
        this.sliderVideos.push
        this.sliderVideos.push(...remainingVideos);
      }

      this.sliderVideos = this.sliderVideos.slice(0, 4);
    },

    startSlider() {
      if (this.sliderInterval) clearInterval(this.sliderInterval);
      if (this.progressInterval) clearInterval(this.progressInterval);

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
      if (this.progressInterval) clearInterval(this.progressInterval);

      this.progressInterval = setInterval(() => {
        if (this.progressPercentage < 100) {
          this.progressPercentage += step;
        }
      }, interval);
    },

    resetProgressBar() {
      if (this.progressInterval) clearInterval(this.progressInterval);
      this.progressPercentage = 0;
      this.startProgressBar();
    },

    goToSlide(index) {
      if (index !== this.currentVideoIndex) {
        this.currentVideoIndex = index;
        this.resetProgressBar();

        if (this.sliderInterval) {
          clearInterval(this.sliderInterval);
          this.startSlider();
        }
      }
    },
  },

  beforeDestroy() {
    if (this.sliderInterval) clearInterval(this.sliderInterval);
    if (this.progressInterval) clearInterval(this.progressInterval);
  },
};
</script>

<template>
  <div class="bg-black text-white relative">
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="sliderVideos.length && !isLoading" class="relative h-screen w-full">
      <!-- Container for all slides -->
      <div class="absolute inset-0">
        <transition-group name="slide">
          <div
            v-for="(video, index) in sliderVideos"
            :key="video.data.id || index"
            class="absolute inset-0 transition-opacity duration-500"
            :class="{ 'opacity-100 z-10': index === currentVideoIndex, 'opacity-0 z-0': index !== currentVideoIndex }"
          >
            <!-- Local video -->
            <video
              :src="`http://127.0.0.1:8090/api/files/videos/${video.data.id}/${video.data.VideoTele}`"
              class="w-full h-full object-cover"
              autoplay
              muted
              loop
              playsinline
            ></video>

            <!-- Gradients -->
            <div class="absolute inset-x-0 bottom-0" style="background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); height: 50%;"></div>
            <div class="hidden md:block absolute inset-y-0 left-0" style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); width: 50%;"></div>

            <!-- Content -->
            <div class="absolute inset-0 flex flex-col justify-end items-center text-center md:text-start p-6 text-white md:justify-center md:items-start md:p-12">
              <h1 class="text-sm font-[400] mb-[1rem] md:text-sm md:mb-12 tracking-[0.5em]">
                ÉMISSION
              </h1>
              <h1 class="text-5xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase">
                {{ video.data.title }}
              </h1>
              <p class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
                {{ video.data.description?.slice(0, 70) + '...' }}
              </p>

              <!-- Action Buttons -->
              <div v-if="index === currentVideoIndex" class="mb-10 flex gap-4">
                <RouterLink
                  :to="{ name: 'singleVideoPocket2', params: { id: video.data.id } }"
                  class="bg-white hover:bg-gray-300 text-oranges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all z-20"
                >
                  LECTURE
                </RouterLink>

                <RouterLink
                  :to="{ name: 'singleVideoPocket', params: { id: video.data.id } }"
                  class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all z-20"
                >
                  PLUS D'INFO
                </RouterLink>
              </div>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Navigation Dots -->
      <div class="absolute bottom-4 md:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
        <div
          v-for="(video, index) in sliderVideos"
          :key="index"
          @click="goToSlide(index)"
          class="w-5 h-5 relative cursor-pointer"
        >
          <div class="absolute inset-0 rounded-full bg-white/30"></div>
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

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
