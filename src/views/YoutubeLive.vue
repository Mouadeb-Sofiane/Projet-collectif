<script>
import { fetchLiveStream } from '@/services/YoutubeServices';

export default {
  data() {
    return {
      liveVideo: null,
      isLoading: true,
      errorMessage: '',
    };
  },

  async mounted() {
    this.isLoading = true;

    try {
      this.liveVideo = await fetchLiveStream();
    } catch (error) {
      console.error('Erreur lors du chargement du live YouTube:', error);
      this.errorMessage = 'Impossible de charger le live YouTube.';
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<template>
  <div class="bg-black text-white h-screen flex flex-col items-center justify-center p-4">
    <!-- Chargement -->
    <div v-if="isLoading" class="text-center">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement du live...</h1>
    </div>

    <!-- Erreur -->
    <div v-if="errorMessage" class="text-red-500 text-center">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Vidéo en direct -->
    <div v-if="liveVideo" class="w-full h-full">
      <iframe
        :src="`https://www.youtube.com/embed/${liveVideo.id?.videoId}?autoplay=1&mute=1&controls=1`"
        class="w-full h-full"
        frameborder="0"
        allow="autoplay; encrypted-media"
      ></iframe>
    </div>

    <!-- Aucun live disponible -->
    <div v-else-if="!isLoading" class="text-center">
      <h1 class="text-2xl font-semibold mb-4">Aucun live disponible actuellement</h1>
      <p class="mb-4">Veuillez visiter notre chaîne YouTube pour plus de contenu.</p>
      <a
        href="https://www.youtube.com/@IUTV-ytb/playlists"
        target="_blank"
        class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-all"
      >
        Voir la chaîne YouTube
      </a>
    </div>
  </div>
</template>

<style scoped>
/* Animation pour un meilleur visuel pendant le chargement */
@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 1.5s infinite;
}
</style>
