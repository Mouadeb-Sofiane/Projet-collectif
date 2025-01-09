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
  VideoTele: string;
  videoId?: string;
};

// Données réactives
const selectedPlaylist = ref<Playlist | null>(null);
const playlistsVideos = reactive<Record<string, Video[]>>({});
const isLoading = ref(true);
const errorMessage = ref('');

// Charger les playlists et en sélectionner une aléatoirement
onMounted(async () => {
  isLoading.value = true;
  try {
    const pb = new PocketBase('http://127.0.0.1:8090');

    // Récupérer les playlists
    const playlists = await pb.collection('playlists').getFullList<Playlist>();

    if (playlists.length > 0) {
      // Sélectionner une playlist aléatoirement
      const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

      // Charger la vignette de la playlist
      const videos = await pb.collection('videos').getFullList<Video>(1, {
        filter: `id_playlists~"${randomPlaylist.id}"`,
      });

      if (videos.length > 0) {
        const video = videos[0];
        randomPlaylist.thumbnailurl = video.videoId
          ? `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
          : null;
      } else {
        randomPlaylist.thumbnailurl = null;
      }

      selectedPlaylist.value = randomPlaylist;
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    errorMessage.value = 'Impossible de charger la playlist.';
  } finally {
    isLoading.value = false;
  }
});

// Charger les vidéos de la playlist sélectionnée
const loadPlaylistVideos = async (playlist: Playlist) => {
  if (!playlistsVideos[playlist.id]?.length) {
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');
      const videos = await pb.collection('videos').getFullList<Video>(200, {
        filter: `id_playlists~"${playlist.id}"`,
      });

      playlistsVideos[playlist.id] = videos;
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos pour la playlist:', error);
      errorMessage.value = `Impossible de charger les vidéos pour la playlist ${playlist.title}.`;
    }
  }
};

// Fermer la modale
const closeModal = () => {
  selectedPlaylist.value = null;
};
</script>

<template>
  <div>
    <!-- BANNIÈRE DE LA PLAYLIST -->
    <div v-if="selectedPlaylist && !isLoading" class="banner relative">
      <img
        :src="selectedPlaylist.thumbnailurl || 'default-banner.jpg'"
        :alt="selectedPlaylist.title"
        class="w-full h-64 object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <h2 class="text-white text-3xl font-bold">{{ selectedPlaylist.title }}</h2>
        <button
          class="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          @click="loadPlaylistVideos(selectedPlaylist)"
        >
          Voir les vidéos
        </button>
      </div>
    </div>

    <!-- MODALE -->
    <div
      v-if="selectedPlaylist && playlistsVideos[selectedPlaylist.id]?.length"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @keydown.esc="closeModal"
      tabindex="0"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative modal-content">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          @click="closeModal"
        >
          ✕
        </button>

        <div>
          <h2 class="text-center text-2xl font-bold mb-4">
            Vidéos de la playlist : {{ selectedPlaylist?.title }}
          </h2>
          <img
            :src="selectedPlaylist.thumbnailurl || 'default-banner.jpg'"
            :alt="selectedPlaylist.title"
            class="w-full h-64 object-cover"
          />
          <div
            v-if="playlistsVideos[selectedPlaylist.id]?.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
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
          <p v-else class="text-center text-gray-400">
            Aucune vidéo disponible pour cette playlist.
          </p>
        </div>
      </div>
    </div>

    <!-- MESSAGE D'ERREUR -->
    <div v-if="errorMessage" class="text-red-500 text-center mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.banner {
  position: relative;
  margin-bottom: 2rem;
}

.banner img {
  border-radius: 0.5rem;
}

.banner button {
  font-size: 1rem;
}

/* MODAL CONTENT SCROLLBAR */
.modal-content {
  max-height: 80vh;
  overflow-y: auto;
  padding-right: 1rem;
}

/* Scrollbar personnalisée */
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
