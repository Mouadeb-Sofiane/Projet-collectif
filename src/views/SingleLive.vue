<script>
export default {
  data() {
    return {
      liveVideo: null, // Données du live récupérées
      isLoading: true, // Statut de chargement
      errorMessage: '',
    };
  },
  methods: {
    fetchLiveVideo() {
      // Simule une requête pour récupérer les données du live
      setTimeout(() => {
        // Exemple de données de live YouTube
        this.liveVideo = {
          id: {
            videoId: "exampleVideoId",
          },
          snippet: {
            title: "Titre du Live en cours",
            description: "Ceci est une description du live actuellement en diffusion.",
            thumbnails: {
              high: {
                url: "https://via.placeholder.com/640x360",
              },
            },
          },
        };
        this.isLoading = false;
      }, 2000);
    },
    goToLiveDetails() {
      this.$router.push({
        name: "singleLive",
        params: { details: JSON.stringify(this.liveVideo) },
      });
    },
  },
  mounted() {
    this.fetchLiveVideo();
  },
};
</script>
<template>
    <div class="p-6 text-white bg-gray-900 min-h-screen">
      <h1 class="text-3xl font-bold mb-4 text-center">Live en cours</h1>
  
      <div v-if="isLoading" class="text-center text-gray-400">Chargement...</div>
  
      <div v-if="!isLoading && liveVideo" class="flex flex-col items-center">
        <!-- Image du live -->
        <img
          :src="liveVideo.snippet.thumbnails.high.url"
          alt="Live Thumbnail"
          class="rounded-lg mb-6 w-full md:w-2/3 lg:w-1/2"
        />
  
        <!-- Titre et description -->
        <h2 class="text-2xl font-bold mb-2">{{ liveVideo.snippet.title }}</h2>
        <p class="text-lg text-gray-300 mb-4">{{ liveVideo.snippet.description }}</p>
  
        <!-- Boutons d'action -->
        <div class="mb-10">
          <a
            :href="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1`"
            target="_blank"
            class="bg-white hover:bg-gray-300 text-rouges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
          >
            VOIR LE DIRECT
          </a>
  
          <button
            @click="goToLiveDetails"
            class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all ml-8"
          >
            PLUS D'INFO
          </button>
        </div>
      </div>
  
      <div v-else-if="!isLoading && !liveVideo" class="text-center text-gray-400">
        Aucun live actuellement.
      </div>
  
      <div v-if="errorMessage" class="text-center text-red-500 mt-4">{{ errorMessage }}</div>
    </div>
</template>

  
  <style scoped>
  .bg-gray-900 {
    background-color: #1a202c;
  }
  .text-rouges {
    color: #e53e3e;
  }
  </style>
  