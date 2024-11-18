<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      allVideos: [],
      isLoading: true,
      errorMessage: '', // Ajout de errorMessage
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacez par l'URL de votre instance PocketBase

      // Récupérer les playlists depuis PocketBase
      this.playlists = await pb.collection('playlists').getFullList();

      // Récupérer les vidéos pour chaque playlist
      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos; // Utilisation directe de l'assignation
      }

      // Récupérer toutes les vidéos
      this.allVideos = await pb.collection('videos').getFullList(200);
    } catch (error) {
      console.error('Erreur lors du chargement des données depuis PocketBase:', error);
      this.errorMessage = 'Une erreur est survenue lors du chargement des vidéos.'; // Mise à jour de errorMessage
    } finally {
      this.isLoading = false;
    }
  },
};
</script>


<template>
  <div class="p-4">
    <!-- Chargement en cours -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Affichage des playlists et vidéos -->
    <div v-if="playlists.length && !isLoading">
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="playlist in playlists" 
          :key="playlist.id" 
          class="playlist-block bg-white rounded-lg shadow-md p-4"
        >
          <div class="playlist-thumbnail">
            <img 
              :src="playlist.thumbnailUrl" 
              :alt="playlist.title" 
              class="w-full h-40 object-cover rounded-md"
            />
            <h3 class="text-lg font-semibold mt-2 text-center">{{ playlist.title }}</h3>
          </div>

          <!-- Vidéos associées à chaque playlist -->
          <div v-if="playlistsVideos[playlist.id]?.length" class="mt-4 space-y-4">
            <div 
              v-for="video in playlistsVideos[playlist.id]" 
              :key="video.id" 
              class="video-item flex flex-col items-center"
            >
              <h4 class="text-base font-medium">{{ video.title }}</h4>
              <p class="text-sm text-gray-600 text-center">{{ video.description }}</p>
              <p class="text-xs text-gray-500">Date de publication : {{ video.publishedAt }}</p>
              <router-link 
                :to="{ name: 'singleVideoPocket', params: { id: video.id } }" 
                class="w-full mt-2"
              >
                <img 
                  :src="video.thumbnailUrl" 
                  :alt="video.title" 
                  class="w-full h-32 object-cover rounded-md"
                />
                <button 
                  class="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
                >
                  Regarder
                </button>
               
              </router-link>
            </div>
          </div>
          <div v-else class="mt-4 text-center text-gray-500">
            <p>Aucune vidéo disponible pour cette playlist.</p>
          </div>
        </div>
      </div>

      <!-- Section Toutes les vidéos -->
      <h2 class="text-3xl font-bold text-center my-6">Toutes les Vidéos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="video in allVideos" 
          :key="video.id" 
          class="video-item bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
        >
          <h4 class="text-base font-medium">{{ video.title }}</h4>
          <p class="text-sm text-gray-600 text-center">{{ video.description }}</p>
          <p class="text-xs text-gray-500">Date de publication : {{ video.publishedAt }}</p>
          <router-link 
            :to="{ name: 'singleVideoPocket', params: { id: video.id } }" 
            class="w-full mt-2"
          >
            <img 
              :src="video.thumbnailUrl" 
              :alt="video.title" 
              class="w-full h-32 object-cover rounded-md"
            />
            <button 
              class="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
            >
              Regarder
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
