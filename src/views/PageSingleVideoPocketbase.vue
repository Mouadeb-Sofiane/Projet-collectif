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
      const videoId = this.$route.params.id;

      // Récupérer les détails de la vidéo
      this.video = await pb.collection('videos').getOne(videoId);

      if (!this.video) {
        this.errorMessage = 'Vidéo introuvable.';
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la vidéo :', error);
      this.errorMessage = 'Impossible de charger la vidéo.';
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    formatDuration(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins} min ${secs} sec`;
    },
  },
};
</script>

<template>
  <div class="p-4">
    <div v-if="isLoading" class="text-center">
      <p>Chargement de la vidéo...</p>
    </div>

    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="video && !isLoading">
      <h1 class="text-3xl font-bold text-center">{{ video.title }}</h1>
      <p class="text-center text-gray-500">{{ video.description }}</p>
      <
      <RouterLink :to="{ name: 'singleVideoPocket2', params: { id: video.id } }"
      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
      >
      Aller à Single 2
      </RouterLink>

      <div class="flex justify-center mt-4">
        <video 
          v-if="video.VideoTele"
          :src="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`" 
          controls 
          class="w-full md:w-2/3 h-64 md:h-96">
        </video>
      </div>

      <p class="text-sm text-gray-500 mt-4 text-center">
        Date de publication : {{ new Date(video.date).toLocaleDateString('fr-FR') }}
      </p>
      <p>Durée : {{ formatDuration(video.duree) }}</p>
    </div>
  </div>
</template>
