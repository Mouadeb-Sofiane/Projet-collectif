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
const playlists = ref<Playlist[]>([]);
const playlistsVideos = reactive<Record<string, Video[]>>({});
const selectedPlaylist = ref<Playlist | null>(null);
const isLoading = ref(true);
const errorMessage = ref('');

// Sélectionner une playlist
const selectPlaylist = async (playlist: Playlist) => {
  selectedPlaylist.value = playlist;

  // Charger les vidéos si elles ne sont pas déjà chargées
  if (!playlistsVideos[playlist.id]?.length) {
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');
      const videos = await pb.collection('videos').getFullList<Video>(200, {
        filter: `id_playlists~"${playlist.id}"`,
      });

      // Stocker les vidéos dans playlistsVideos
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

// Charger les playlists lors du montage du composant
onMounted(async () => {
  isLoading.value = true;
  try {
    const pb = new PocketBase('http://127.0.0.1:8090');

    // Récupérer les playlists
    const fetchedPlaylists = await pb.collection('playlists').getFullList<Playlist>();

    // Ajouter les miniatures
    const updatedPlaylists = await Promise.all(
      fetchedPlaylists.map(async (playlist) => {
        try {
          const videos = await pb.collection('videos').getFullList<Video>(1, {
            filter: `id_playlists~"${playlist.id}"`,
          });

          if (videos.length > 0) {
            const video = videos[0];
            playlist.thumbnailurl = video.videoId
              ? `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`
              : null;
          } else {
            playlist.thumbnailurl = null;
          }
        } catch (error) {
          console.error(`Erreur lors du chargement des vidéos pour la playlist ${playlist.id}:`, error);
          playlist.thumbnailurl = null;
        }
        return playlist;
      })
    );

    playlists.value = updatedPlaylists;
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
    errorMessage.value = 'Impossible de charger les playlists.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <!-- Playlists -->
    <div v-if="playlists.length && !isLoading" class="playlists p-6">
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist bg-gray-800 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700"
          @click="selectPlaylist(playlist)"
        >
          <h3 class="text-lg font-bold text-center">{{ playlist.title }}</h3>
          <img
            v-if="playlist.thumbnailurl"
            :src="playlist.thumbnailurl"
            alt="Vignette de la playlist"
            class="w-full h-40 object-cover rounded-t-lg"
          />
          <p v-else class="text-center text-gray-400">
            Aucune vignette disponible
          </p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedPlaylist"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @keydown.esc="closeModal"
      tabindex="0"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative max-h-[90vh] overflow-y-auto">
        <!-- Bouton pour fermer -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          @click="closeModal"
        >
          ✕
        </button>

        <!-- Contenu du Modal -->
        <div>
          <h2 class="text-center text-2xl font-bold mb-4">
            Vidéos de la playlist : {{ selectedPlaylist?.title }}
          </h2>
          <img
            :src="selectedPlaylist.thumbnailurl || 'default-banner.jpg'"
            :alt="selectedPlaylist.title"
            class="w-full h-64 object-cover mb-4"
          />

          <!-- Liste des vidéos -->
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

          <!-- Message si aucune vidéo disponible -->
          <p v-else class="text-center text-gray-400">
            Aucune vidéo disponible pour cette playlist.
          </p>
        </div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="text-red-500 text-center mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>
