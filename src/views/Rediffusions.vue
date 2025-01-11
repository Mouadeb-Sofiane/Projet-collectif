<template>
    <div class="bg-black text-white pt-28 p-6">
      <!-- Titre principal -->
      <h2 class="text-2xl md:text-3xl font-bold my-6">Nos dernières rediffusions</h2>
      <div class="relative mb-8 mr-12">
      <div class="h-1.5 w-[75%] md:w-[50%] lg:w-[25%] bg-primaryColor"></div>
    </div>
  
      <!-- Liste des vidéos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="(video, index) in sliderVideos"
          :key="video.id"
          class="rounded-lg overflow-hidden shadow-lg relative group"
        >
          <!-- Image vidéo -->
          <Router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
            <img
              :src="video.customThumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`"
              alt="Vignette vidéo"
              class="w-full h-[180px] object-cover group-hover:brightness-75 transition-all"
            />
          </Router-link>
  

  
          <!-- Titre vidéo -->
          <div class="p-4">
            <h3 class="text-lg font-bold truncate">{{ video.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import PocketBase from 'pocketbase';
  
  export default {
    data() {
      return {
        sliderVideos: [], // Liste des vidéos dynamiques
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
          customThumbnail: video.custom_thumbnail || null,
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos :', error);
      }
    },
    methods: {
      formatDuration(duration) {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
  
        return hours
          ? `${hours}h${minutes < 10 ? '0' : ''}${minutes}`
          : `${minutes}m${seconds < 10 ? '0' : ''}${seconds}`;
      },
    },
  };
  </script>
  
  <style scoped>
  .group-hover\:brightness-75:hover {
    filter: brightness(75%);
  }
  </style>
  