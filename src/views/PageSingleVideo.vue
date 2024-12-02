<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      video: null,
      isLoading: true,
      errorMessage: '',
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');
      const videoId = this.$route.params.id;

      const fetchedVideo = await pb.collection('videos').getOne(videoId);
      console.log('Données récupérées :', fetchedVideo);

      if (fetchedVideo) {
        this.video = fetchedVideo;
      } else {
        this.errorMessage = 'Vidéo introuvable.';
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la vidéo :', error);
      this.errorMessage = 'Impossible de charger la vidéo.';
    } finally {
      this.isLoading = false;
    }
    if (fetchedVideo) {
      this.video = {
      ...fetchedVideo,
      duree: fetchedVideo.duree || 0, // Assurez une valeur par défaut pour éviter null
    };
      } else {
        this.errorMessage = 'Vidéo introuvable.';
    }
    this.status = this.liveVideo ? 'EN DIRECT' : 'EMISSION';s


  },
  methods: {

  },
  
};
</script>

<template>
  <div class="bg-black text-white">
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <p class="text-2xl font-semibold animate-pulse">Chargement de la vidéo...</p>
  </div>

  <div v-if="errorMessage" class="text-center text-red-500">
    <p>{{ errorMessage }}</p>
  </div>

  <div v-if="video && !isLoading" class="featured-video mb-12">
    <div class="relative w-full h-screen overflow-hidden">

    <video 
      v-if="video.VideoTele"
      :src="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`"
      class="w-full h-full object-cover"
      loop
      playsinline>
    </video>
  
    <div 
      class="absolute inset-x-0 bottom-0"
      style="background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); height: 50%;"
    ></div>
  
    <div class="absolute inset-0 flex flex-col justify-end items-center text-center md:text-start p-6 text-white md:justify-center md:items-start md:p-12">
      <h1 v-if="video.title" class="text-xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase">
        {{ video.title }}
      </h1>
      <p v-if="video.description" class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
        {{ 
          video.description.length > 70 
          ? video.description.slice(0, 70) + '...' 
          : video.description 
        }}
      </p>
      <div class="flex gap-4 text-bold text-white">
        <h1 v-if="status" class="text-xl font-[400] mb-[1rem] md:text-sm md:mb-12 tracking-[0.5em]">
         {{ status }}
        </h1>

        <p v-if="video?.date" class="text-sm text-white mt-4 text-center">
          {{ new Date(video.date).toLocaleDateString('fr-FR') }}
        </p>
        <p v-else class="text-sm text-gray-500 mt-4 text-center">
          Date de publication : Non disponible
        </p>
        <p class="text-sm text-white mt-4 text-center">{{ video?.duree !== null && video?.duree !== undefined ? video.duree : 'Non disponible' }}</p>
    </div>


      <RouterLink
        v-if="video.id"
        :to="{ name: 'singleVideoPocket2', params: { id: video.id } }"
        class="bg-white hover:bg-gray-300 text-oranges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
      >
        Aller à Single 2
      </RouterLink>
    </div>
  </div>
  </div>

  <div>
    <p v-if="video?.date" class="text-sm text-gray-500 mt-4 text-center">
      Date de publication : {{ new Date(video.date).toLocaleDateString('fr-FR') }}
    </p>
    <p v-else class="text-sm text-gray-500 mt-4 text-center">
      Date de publication : Non disponible
    </p>
    <p>Durée : {{ video?.duree !== null && video?.duree !== undefined ? video.duree : 'Non disponible' }}</p>
  </div>
</div>

</template>