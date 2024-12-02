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
      const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacez par votre URL
      const videoId = this.$route.params.id; // Récupérer l'ID de la vidéo depuis les paramètres d'URL

      // Récupérer les détails de la vidéo depuis PocketBase
      this.video = await pb.collection('videos').getOne(videoId);
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
  <div class="p-4 bg-black  text-white">
    <!-- Afficher un message de chargement -->
    <div v-if="isLoading" class="text-center">
      <p>Chargement de la vidéo...</p>
    </div>

    <!-- Afficher un message d'erreur -->
    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Afficher la vidéo uniquement si les données sont disponibles -->
    <div v-if="video && !isLoading">
      <h1 class="text-3xl font-bold text-center">{{ video.title }}</h1>
      <p class="text-center text-gray-500">{{ video.description }}</p>
      
      <!-- Afficher la vidéo depuis PocketBase -->
      <div class="flex justify-center mt-4">
        <video 
          :src="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`" 
          controls 
          class="w-full md:w-2/3 h-64 md:h-96">
        </video>
      </div>

      <p class="text-sm text-gray-500 mt-4 text-center">
        Date de publication : {{ video.date }}
      </p>
      <p>Durée : {{ video.duree }}</p>
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
