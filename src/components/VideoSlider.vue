<template>
    <div class="relative h-screen w-full">
      <div class="absolute inset-0">
        <div
          v-for="(video, index) in sliderVideos"
          :key="index"
          class="absolute inset-0 transition-opacity duration-500"
          :class="{ 'opacity-100': index === currentVideoIndex, 'opacity-0': index !== currentVideoIndex }"
        >
          <iframe
            v-if="video.type === 'youtube' && video.data.id && video.data.id.videoId"
            :src="`https://www.youtube.com/embed/${video.data.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${video.data.id.videoId}`"
            class="w-full h-full object-cover"
            frameborder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
          <video
            v-if="video.type === 'local' && video.data.id && video.data.VideoTele"
            :src="`http://127.0.0.1:8090/api/files/videos/${video.data.id}/${video.data.VideoTele}`"
            class="w-full h-full object-cover"
            autoplay
            muted
            loop
            playsinline
          ></video>
        </div>
      </div>
  
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
        <div
          v-for="(video, index) in sliderVideos"
          :key="index"
          @click="goToSlide(index)"
          class="w-4 h-4 rounded-full cursor-pointer relative"
        >
          <div class="absolute inset-0 rounded-full bg-white/30">
            <div
              v-if="index === currentVideoIndex"
              class="absolute left-0 top-0 h-full bg-white rounded-full transition-all duration-300 ease-linear"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "VideoSlider",
    props: {
      sliderVideos: Array,
      currentVideoIndex: Number,
      progressPercentage: Number,
    },
    methods: {
      goToSlide(index) {
        this.$emit("updateSlide", index);
      },
    },
  };
  </script>
  