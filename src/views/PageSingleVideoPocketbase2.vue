<template>
  <div class="p-6 pt-36 bg-black text-white">
    <!-- Message de chargement -->
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <p class="text-lg">Chargement de la vidéo...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="text-center text-red-500 py-6">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Contenu principal -->
    <h1 class="pb-6 uppercase text-3xl md:text-4xl font-bold mb-4">{{ video.title }}</h1>
    <div v-if="video && !isLoading" class="max-w-7xl mx-auto lg:flex lg:items-start lg:space-x-8">
      <!-- Vidéo -->
      <div class="relative flex justify-center mb-8 lg:w-2/3">
        <video 
          :src="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`" 
          controls 
          class="w-full rounded-md shadow-lg">
        </video>
      </div>

      <!-- Informations texte -->
      <div class="md:w-1/3 space-y-8">
        <!-- Titre de la vidéo -->
       
        
        <!-- Description de la vidéo -->
        <p class="text-gray-400 mb-6">{{ video.description }}</p>

        <!-- Informations supplémentaires -->
        <div class="space-y-4">
          <div>
            <h3 class="text-xl font-semibold">Description</h3>
            <p class="text-gray-300">{{ video.description }}</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold">Casting</h3>
            <p class="text-gray-300">{{ video.casting }}</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold">Réalisé par</h3>
            <p class="text-gray-300">{{ video.realisation }}</p>
          </div>

          <div class="flex justify-between text-sm text-gray-400">
            <p>Date de publication : {{ video.date ? new Date(video.date).toLocaleDateString('fr-FR') : 'Non disponible' }}</p>
            <p>Durée : {{ video.duree || 'Non disponible' }}</p>
          </div>
        </div>

        <!-- Bouton de partage -->
        <div class="flex justify-start mt-8">
          <button class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md">Partager</button>
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

<style>
/* Ajoutez des styles supplémentaires ici si nécessaire */
</style>
