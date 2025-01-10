<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import PocketBase from 'pocketbase';

// Types
type Playlist = {
  id: string;
  title: string;
  thumbnailurl: string | null;
};

type Video = {
  id: string;
  title: string;
  VideoTele: string | null;
  videoId?: string;
};

// Données réactives
const selectedPlaylist = ref<Playlist | null>(null);
const playlistsVideos = reactive<Record<string, Video[]>>({});
const isLoading = ref(false);
const errorMessage = ref('');
const isModalOpen = ref(false);

// Charger les playlists et sélectionner une playlist aléatoire
const loadPlaylists = async () => {
  isLoading.value = true;
  const pb = new PocketBase('http://127.0.0.1:8090');

  try {
    const playlists = await pb.collection('playlists').getFullList<Playlist>();

    if (playlists.length > 0) {
      const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

      // Charger les vidéos de la playlist sélectionnée
      const videos = await pb.collection('videos').getFullList<Video>(1, {
        filter: `id_playlists~"${randomPlaylist.id}"`,
      });

      randomPlaylist.thumbnailurl = videos.length > 0 && videos[0].videoId
        ? `https://img.youtube.com/vi/${videos[0].videoId}/maxresdefault.jpg`
        : null;

      selectedPlaylist.value = randomPlaylist;
    } else {
      errorMessage.value = 'Aucune playlist trouvée.';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des playlists:', error);
    errorMessage.value = 'Impossible de charger les playlists.';
  } finally {
    isLoading.value = false;
  }
};

// Charger les vidéos d'une playlist spécifique
const loadPlaylistVideos = async (playlist: Playlist) => {
  if (!playlistsVideos[playlist.id]?.length) {
    isLoading.value = true;
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
      const videos = await pb.collection('videos').getFullList<Video>(200, {
        filter: `id_playlists~"${playlist.id}"`,
      });

      playlistsVideos[playlist.id] = videos;
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
      errorMessage.value = `Impossible de charger les vidéos de la playlist ${playlist.title}.`;
    } finally {
      isLoading.value = false;
    }
  }
};

// Gestion du modal
const openModal = () => {
  if (selectedPlaylist.value) {
    loadPlaylistVideos(selectedPlaylist.value);
    isModalOpen.value = true;
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Appel initial
onMounted(() => {
  loadPlaylists();
});
</script>
<template>
    <div>
      <!-- Bannière de la playlist -->
      <div v-if="selectedPlaylist && !isLoading" class="banner relative">
        <img
          v-if="selectedPlaylist.thumbnailurl"
          :src="selectedPlaylist.thumbnailurl"
          :alt="selectedPlaylist.title"
          class="w-full h-64 object-cover rounded"
        />
        <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h2 class="text-white text-3xl font-bold">{{ selectedPlaylist?.title }}</h2>
          <button
            class="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            @click="openModal"
          >
            Voir les vidéos
          </button>
        </div>
      </div>
  
      <!-- Modale -->
      <div
        v-if="isModalOpen && selectedPlaylist"
        class="modal fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto"
        @keydown.esc="closeModal"
        tabindex="0"
      >
        <div class="modal-content bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative">
          <button
            class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            @click="closeModal"
          >
            ✕
          </button>
  
          <h2 class="text-center text-2xl font-bold mb-4">
            Vidéos de la playlist : {{ selectedPlaylist?.title }}
          </h2>
          <img
            :src="selectedPlaylist.thumbnailurl || 'default-banner.jpg'"
            :alt="selectedPlaylist.title"
            class="w-full h-64 object-cover mb-4"
          />

  
          <div v-if="playlistsVideos[selectedPlaylist.id]?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="video in playlistsVideos[selectedPlaylist.id]"
              :key="video.id"
              class="video-item bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h4 class="text-center mt-2">{{ video.title }}</h4>
              <video
                :src="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`"
                class="w-full mt-2 rounded-lg"
                controls
              ></video>
            </div>
          </div>
  
          <p v-else class="text-center text-gray-400">Aucune vidéo disponible pour cette playlist.</p>
        </div>
      </div>
  
      <!-- Message d'erreur -->
      <div v-if="errorMessage" class="text-red-500 text-center mt-4">
        {{ errorMessage }}
      </div>
  
      <!-- Indicateur de chargement -->
      <div v-if="isLoading" class="text-center mt-4">Chargement en cours...</div>
    </div>
  </template>
<style scoped>
/* Bannière */
.banner img {
  border-radius: 0.5rem;
}

.banner button {
  font-size: 1rem;
}

/* Modal */
.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 1rem;
}

/* Scrollbar styles */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}
</style>
  