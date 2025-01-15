<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PocketBase from "pocketbase";
import PlaylistModal from "./PlaylistModal.vue"; // Import du composant modal

// Types
type Playlist = {
  id: string;
  title: string;
  thumbnailurl: string | null;
  miniaturePlaylist?: string;
  description?: string;
  date?: string;
};

type Video = {
  id: string;
  title: string;
  VideoTele: string;
  videoId?: string;
  description?: string;
  duree?: string;
  date?: string;
};

// Données réactives
const playlists = ref<Playlist[]>([]);
const playlistsVideos = reactive<Record<string, Video[]>>({});
const selectedPlaylist = ref<Playlist | null>(null);
const isLoading = ref(true);
const errorMessage = ref("");
const isModalOpen = ref(false);

// Sélectionner une playlist
const selectPlaylist = async (playlist: Playlist) => {
  selectedPlaylist.value = playlist;
  isModalOpen.value = true;

  // Charger les vidéos si elles ne sont pas déjà chargées
  if (!playlistsVideos[playlist.id]?.length) {
    try {
      const pb = new PocketBase("http://127.0.0.1:8090");
      const videos = await pb.collection("videos").getFullList<Video>(200, {
        filter: `id_playlists~"${playlist.id}"`,
      });

      // Stocker les vidéos dans playlistsVideos
      playlistsVideos[playlist.id] = videos;
    } catch (error) {
      console.error("Erreur lors du chargement des vidéos pour la playlist:", error);
      errorMessage.value = `Impossible de charger les vidéos pour la playlist ${playlist.title}.`;
    }
  }
};

// Fermer la modale
const closeModal = () => {
  isModalOpen.value = false;
  selectedPlaylist.value = null;
};

// Charger les playlists lors du montage du composant
onMounted(async () => {
  isLoading.value = true;
  try {
    const pb = new PocketBase("http://127.0.0.1:8090");

    // Récupérer les playlists
    const fetchedPlaylists = await pb.collection("playlists").getFullList<Playlist>();

    // Ajouter la miniature de la première vidéo de chaque playlist
    const updatedPlaylists = [];
    for (const playlist of fetchedPlaylists) {
      try {
        const videos = await pb.collection("videos").getFullList<Video>(1, {
          filter: `id_playlists~"${playlist.id}"`,
        });

        if (videos.length > 0) {
          const video = videos[0]; // Prendre uniquement la première vidéo
          playlist.thumbnailurl = video.videoId
            ? `https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`
            : null;
        } else {
          playlist.thumbnailurl = null; // Si aucune vidéo n'est disponible
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des vidéos pour la playlist ${playlist.id}:`, error);
        playlist.thumbnailurl = null;
      }
      updatedPlaylists.push(playlist); // Ajouter la playlist au tableau mis à jour après avoir traité la vidéo
    }

    playlists.value = updatedPlaylists;
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    errorMessage.value = "Impossible de charger les playlists.";
  } finally {
    isLoading.value = false;
  }
});
</script>


<template>
  <div class="bg-black">
    <!-- Playlists Grid -->
    <div v-if="playlists.length && !isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 mx-auto max-w-[2000px]">
      <div v-for="playlist in playlists" :key="playlist.id" class="relative aspect-[4/3] cursor-pointer group" @click="selectPlaylist(playlist)">
        <img v-if="playlist.thumbnailurl" :src="playlist.thumbnailurl" :alt="playlist.title" class="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105" />
      </div>
    </div>

    <!-- PlaylistModal component remains the same -->
    <PlaylistModal
      :is-open="isModalOpen"
      :playlist="selectedPlaylist"
      :videos="selectedPlaylist ? playlistsVideos[selectedPlaylist.id] || [] : []"
      :on-close="closeModal"
    />

    <!-- Error message remains the same -->
    <div v-if="errorMessage" class="text-red-500 text-center mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.grid {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

@media (min-width: 768px) {
  .grid {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
}
</style>