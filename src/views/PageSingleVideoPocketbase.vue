<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      video: null, // Détails de la vidéo
      isLoading: true, // Indicateur de chargement
      errorMessage: '', // Message d'erreur
      status: '', // Statut actuel (EN DIRECT ou EMISSION)
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');
      const videoId = this.$route.params.id;

      // Récupérer les détails de la vidéo depuis PocketBase
      const fetchedVideo = await pb.collection('videos').getOne(videoId);
      console.log('Données récupérées :', fetchedVideo);

      if (fetchedVideo) {
        // Assurez-vous que les données sont correctement initialisées
        this.video = {
          ...fetchedVideo,
          duree: fetchedVideo.duree || 0, // Valeur par défaut pour la durée
        };

        // Déterminer le statut en fonction des données récupérées
        this.status = fetchedVideo.isLive ? 'EN DIRECT' : 'EMISSION';
      } else {
        this.errorMessage = 'Vidéo introuvable.';
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la vidéo :', error);
      this.errorMessage = 'Impossible de charger la vidéo.';
    } finally {
      this.isLoading = false;
    }
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

      <div class="flex text-white gap-4 font-bold">
        <h1 v-if="status" class="text-sm md:text-sm mt-4 text-center">
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

      <p v-if="video.description" class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
        {{ 
          video.description.length > 70 
          ? video.description.slice(0, 70) + '...' 
          : video.description 
        }}
      </p>
      <RouterLink
        v-if="video.id"
        :to="{ name: 'singleVideoPocket2', params: { id: video.id } }"
        class="bg-white hover:bg-gray-300 text-oranges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
      >
        LECTURE
      </RouterLink>
    </div>
  </div>
</div>

  <div>
    <h3>Description</h3>
      <p>{{ video?.description }}</p>
      <button>Partager</button>
    <h3>Casting</h3>
      <p>{{ video?.casting }}</p> 
    <h3>Réaliser par</h3>
      <p>{{ video?.realisation }}</p>

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