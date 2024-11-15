<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      isLoading: true,
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
          filter: `youtubePlaylistId="${playlist.id}"`,
        });
        this.$set(this.playlistsVideos, playlist.id, videos);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données depuis PocketBase:', error);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<template>
  <div class="p-4">
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

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
                :to="{ name: 'singleVideo', params: { id: video.id } }" 
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
    </div>
  </div>
</template>


