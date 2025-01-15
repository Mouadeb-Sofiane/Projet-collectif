<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from "vue";
import PocketBase from "pocketbase";
import PlaylistModal from "./PlaylistModal.vue";

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

// Fonction pour calculer la largeur de la scrollbar
const getScrollbarWidth = (): number => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode?.removeChild(outer);

  return scrollbarWidth;
};

// Watch pour la gestion du scroll
watch(isModalOpen, (newValue) => {
  if (newValue) {
    const scrollbarWidth = getScrollbarWidth();
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('modal-open', 'modal-open-overflow');
  } else {
    document.body.classList.remove('modal-open', 'modal-open-overflow');
  }
});

// Gestionnaire de touche Escape
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

// Sélectionner une playlist
const selectPlaylist = async (playlist: Playlist) => {
  selectedPlaylist.value = playlist;
  isModalOpen.value = true;

  if (!playlistsVideos[playlist.id]?.length) {
    try {
      const pb = new PocketBase("http://127.0.0.1:8090");
      const videos = await pb.collection("videos").getFullList<Video>(200, {
        filter: `id_playlists~"${playlist.id}"`,
      });
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

// Cycle de vie du composant
onMounted(async () => {
  document.addEventListener('keydown', handleKeyDown);
  
  isLoading.value = true;
  try {
    const pb = new PocketBase("http://127.0.0.1:8090");
    const fetchedPlaylists = await pb.collection("playlists").getFullList<Playlist>();
    
    const updatedPlaylists = [];
    for (const playlist of fetchedPlaylists) {
      try {
        const videos = await pb.collection("videos").getFullList<Video>(1, {
          filter: `id_playlists~"${playlist.id}"`,
        });

        if (videos.length > 0) {
          playlist.thumbnailurl = videos[0].videoId
            ? `https://img.youtube.com/vi/${videos[0].videoId}/sddefault.jpg`
            : null;
        } else {
          playlist.thumbnailurl = null;
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des vidéos pour la playlist ${playlist.id}:`, error);
        playlist.thumbnailurl = null;
      }
      updatedPlaylists.push(playlist);
    }

    playlists.value = updatedPlaylists;
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    errorMessage.value = "Impossible de charger les playlists.";
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.body.classList.remove('modal-open', 'modal-open-overflow');
  document.body.style.removeProperty('--scrollbar-width');
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

    <!-- PlaylistModal component -->
    <PlaylistModal
      :is-open="isModalOpen"
      :playlist="selectedPlaylist"
      :videos="selectedPlaylist ? playlistsVideos[selectedPlaylist.id] || [] : []"
      :on-close="closeModal"
    />

    <!-- Error message -->
    <div v-if="errorMessage" class="text-red-500 text-center mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
.modal-open {
  overflow: hidden;
  padding-right: var(--scrollbar-width);
}

.modal-open-overflow {
  overflow-y: hidden;
}

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