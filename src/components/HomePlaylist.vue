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
        videoId: video.videoId,
        duree: video.duree,
        description: video.description,
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
<template>
  <div class="carousel-container relative bg-thirdColor mt-14 text-white p-6 w-full px-12">
    <h2 class="text-2xl md:text-3xl font-bold my-6">Revivez nos précédentes émissions</h2>
    <div class="relative mb-8 mr-12">
      <div class="h-1.5 w-[75%] md:w-[50%] lg:w-[25%] bg-primaryColor"></div>
    </div>
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
          <div class="rounded-lg shadow-md">
            <div class="relative w-full aspect-video flex-shrink-0">
              <RouterLink :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <img
                  :src="`https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`"
                  alt="Vignette de la vidéo"
                  class="w-full h-full object-cover"
                />
              </RouterLink>
              <div>
                <span v-if="video.duration" class="bg-primaryColor absolute bottom-2 right-2 bg-black bg-opacity-75 text-black text-xs px-2 py-1 rounded">
                  {{ formatDuration(video.duration) }}
                </span>
                <span v-else class="bg-primaryColor absolute bottom-2 right-2 bg-black bg-opacity-75 text-black font-semibold text-xs px-2 py-1 rounded">
                  {{ video.duree }}
                </span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="md:text-xl font-bold truncate">{{ video.title }}</h3>
              <h3 class="mt-1 font-light text-sm truncate line-clamp-2">{{ video.description }}</h3>
              
            </div>
          </div>
        </div>
      </div>
      <!-- Flèches navigation -->
      <button
        v-if="currentIndex > 0"
        @click="scrollPrev"
        class="absolute top-1/2 left-[-0.3rem] transform -translate-y-1/2 w-12 h-[18rem] flex items-center justify-center text-white hover:bg-opacity-80"
        style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
      >
        <svg width="16" height="28" viewBox="0 0 16 28" fill="none" class="transform rotate-180" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.4205 15.4797L2.88369 27.8639L0 24.7684L10.0949 13.932L0 3.09551L2.88369 0L14.4205 12.3842C14.8028 12.7947 15.0176 13.3515 15.0176 13.932C15.0176 14.5125 14.8028 15.0692 14.4205 15.4797Z"
            fill="white"
          />
        </svg>
      </button>
      <button
        v-if="currentIndex + visibleItems < sliderVideos.length"
        @click="scrollNext"
        class="absolute top-1/2 right-[-0.3rem] transform -translate-y-1/2 w-12 h-[18rem] flex items-center justify-center text-white hover:bg-opacity-80"
        style="background: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
      >
        <svg
          width="16"
          height="28"
          viewBox="0 0 16 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.4205 15.4797L2.88369 27.8639L0 24.7684L10.0949 13.932L0 3.09551L2.88369 0L14.4205 12.3842C14.8028 12.7947 15.0176 13.3515 15.0176 13.932C15.0176 14.5125 14.8028 15.0692 14.4205 15.4797Z"
            fill="white"
          />
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

<style scoped>
.carousel-container {
  width: 100%;
}
.carousel {
  max-width: 100%;
}
</style>