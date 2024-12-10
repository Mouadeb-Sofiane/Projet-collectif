<template>
  <div class="carousel-container relative bg-black text-white p-6">
    <h2 class="text-3xl font-bold text-center my-6">Revivez nos précédentes émissions</h2>
    <div class="carousel relative overflow-hidden w-screen">
      <!-- Liste des vignettes -->
      <div
        class="flex transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * itemWidth}px)` }"
        ref="carouselTrack"
      >
        <div
          v-for="(video, index) in sliderVideos"
          :key="video.id"
          class="carousel-item flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 px-2"
        >
          <div class="bg-gray-800 rounded-lg shadow-md">
            <div class="relative overflow-hidden">
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <img
                  :src="video.customThumbnail || video.defaultThumbnail"
                  alt="Vignette de la vidéo"
                  class="w-full h-40 object-cover rounded-t-lg"
                  style="transform: translateX(10%);"
                />
              </router-link>
              <span class="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
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
        class="absolute top-1/2 left-0 transform -translate-y-1/2 w-12 h-full flex items-center justify-center text-white"
        style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
      >
        <span class="text-2xl">&#8592;</span>
      </button>
      <button
        v-if="currentIndex + visibleItems < sliderVideos.length"
        @click="scrollNext"
        class="absolute top-1/2 right-0 transform -translate-y-1/2 w-12 h-full flex items-center justify-center text-white"
        style="background: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
      >
        <span class="text-2xl">&#8594;</span>
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
      } else {
        this.currentIndex = this.sliderVideos.length - this.visibleItems;
      }
    },
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
  max-width: 100%;
  margin: 0 auto;
}
.carousel {
  position: relative;
}
</style>
