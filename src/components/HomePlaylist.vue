<template>
  <div class="carousel-container relative bg-black text-white p-6 w-full">
    <h2 class="text-3xl font-bold text-center my-6">Revivez nos précédentes émissions</h2>
    <div class="carousel relative overflow-hidden w-full">
      <!-- Liste des vignettes -->
      <div
        class="flex transition-transform duration-700 ease-in-out w-full"
        :style="{ transform: `translateX(-${currentIndex * itemWidth}px)` }"
        ref="carouselTrack"
      >
        <div
          v-for="(video, index) in sliderVideos"
          :key="video.id"
          class="carousel-item flex-shrink-0 w-full px-2"
          :style="{ width: `${itemWidth}px` }"
        >
          <div class=" rounded-lg shadow-md">
            <div class="relative">
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <img
                  :src="video.customThumbnail || video.defaultThumbnail"
                  alt="Vignette de la vidéo"
                  class="w-full h-40 object-cover rounded-t-lg"
                />
              </router-link>
              <span class="bg-orange-500 absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {{ formatDuration(video.duration) }}
              </span>
            </div>
            <div class="p-4">
              <h3 class="text-sm font-bold truncate">{{ video.title }}</h3>
            </div>
          </div>
        </div>
      </div>
      <!-- Flèches navigation -->
      <button
        v-if="currentIndex > 0"
        @click="scrollPrev"
        class="absolute top-1/2 left-2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-opacity-80"
        style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        v-if="currentIndex + visibleItems < sliderVideos.length"
        @click="scrollNext"
        class="absolute top-1/2 right-2 transform -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-opacity-80"
        style="background: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    <!-- Indicateurs de pagination -->
    <div class="flex justify-center mt-4">
      <span
        v-for="(video, index) in Math.ceil(sliderVideos.length / visibleItems)"
        :key="index"
        @click="goToSlide(index)"
        :class="['w-3 h-3 mx-1 rounded-full cursor-pointer', currentIndex === index * visibleItems ? 'bg-white' : 'bg-gray-500']"
      ></span>
    </div>
  </div>
</template>

<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      sliderVideos: [],
      currentIndex: 0,
      itemWidth: 0,
      visibleItems: 4, // Par défaut, pour desktop
    };
  },
  async created() {
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');
      const videos = await pb.collection('videos').getFullList({
        sort: '-created',
      });
      this.sliderVideos = videos.map((video) => ({
        id: video.id,
        title: video.title,
        duration: video.duration,
        defaultThumbnail: video.thumbnail_url,
        customThumbnail: video.custom_thumbnail || null,
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos :', error);
    }
  },
  mounted() {
    this.calculateVisibleItems();
    window.addEventListener('resize', this.calculateVisibleItems);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.calculateVisibleItems);
  },
  methods: {
    calculateVisibleItems() {
      const width = window.innerWidth;
      if (width < 640) {
        this.visibleItems = 1;
      } else if (width < 1024) {
        this.visibleItems = 2;
      } else {
        this.visibleItems = 4;
      }
      this.itemWidth = this.$refs.carouselTrack.clientWidth / this.visibleItems;
    },
    scrollNext() {
      if (this.currentIndex + this.visibleItems < this.sliderVideos.length) {
        this.currentIndex += this.visibleItems;
      }
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Scrolls the carousel to the previous set of visible items.
 * Decreases the currentIndex by the number of visible items,
 * ensuring it does not go below zero.
 */
/******  6791764e-e9fc-4203-97b0-a41860b7c197  *******/    },
    scrollPrev() {
      if (this.currentIndex > 0) {
        this.currentIndex -= this.visibleItems;
      }
    },
    goToSlide(index) {
      this.currentIndex = index * this.visibleItems;
    },
    formatDuration(duration) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m${seconds < 10 ? '0' : ''}${seconds}`;
    },
  },
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
}
.carousel {
  max-width: 100%;
}
</style>
