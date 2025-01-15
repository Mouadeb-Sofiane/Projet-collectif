<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue';
import PocketBase from 'pocketbase';
import ReportageModal from './ReportageModal.vue';

// Types
type Playlist = {
  id: string;
  title: string;
  thumbnailurl: string | null;
  description?: string;
  date?: string;
};

type Reportage = {
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
const playlistsReportages = reactive<Record<string, Reportage[]>>({});
const selectedPlaylist = ref<Playlist | null>(null);
const isLoading = ref(true);
const errorMessage = ref('');
const isModalOpen = ref(false);

// Fonction de gestion des erreurs avec réessai
const fetchWithRetry = async (fn: Function, retries = 3, delay = 1000): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Échec de la requête, tentative ${i + 1}...`);
      console.error('Erreur:', error);
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

// Fonction pour obtenir la largeur de la scrollbar
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

  if (!playlistsReportages[playlist.id]?.length) {
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      // Ajustement du filtre pour la requête API
      const filter = `id_playlists_reportages~"${playlist.id}"`;
      console.log(`Filtre API pour la playlist ${playlist.title}: ${filter}`);

      const reportages = await fetchWithRetry(() =>
        pb.collection('reportages').getFullList<Reportage>(200, { filter })
      );

      playlistsReportages[playlist.id] = reportages;
    } catch (error) {
      console.error('Erreur lors du chargement des reportages:', error);
      errorMessage.value = `Impossible de charger les reportages pour la playlist ${playlist.title}.`;
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
  document.addEventListener('keydown', handleKeyDown);

  isLoading.value = true;
  try {
    const pb = new PocketBase('http://127.0.0.1:8090');

    const fetchedPlaylists = await fetchWithRetry(() =>
      pb.collection('playlists_reportages').getFullList<Playlist>()
    );

    // Ajouter les miniatures à chaque playlist
    const updatedPlaylists = await Promise.all(
      fetchedPlaylists.map(async (playlist) => {
        try {
          const reportages = await fetchWithRetry(() =>
            pb.collection('reportages').getFullList<Reportage>(1, {
              filter: `id_playlists_reportages~"${playlist.id}"`,
            })
          );

          // Ajouter une miniature si disponible
          if (reportages.length > 0) {
            const reportage = reportages[0];
            playlist.thumbnailurl = reportage.videoId
              ? `https://img.youtube.com/vi/${reportage.videoId}/sddefault.jpg`
              : null;
          } else {
            playlist.thumbnailurl = null;
          }
        } catch (error) {
          console.error(`Erreur lors du chargement des miniatures pour la playlist ${playlist.id}:`, error);
          playlist.thumbnailurl = null;
        }
        return playlist;
      })
    );

    playlists.value = updatedPlaylists;
  } catch (error) {
    console.error('Erreur lors du chargement des playlists:', error);
    errorMessage.value = 'Impossible de charger les playlists.';
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
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        class="relative aspect-[4/3] cursor-pointer group"
        @click="selectPlaylist(playlist)"
      >
        <img
          v-if="playlist.thumbnailurl"
          :src="playlist.thumbnailurl"
          :alt="playlist.title"
          class="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </div>

    <!-- ReportageModal component -->
    <ReportageModal
      :is-open="isModalOpen"
      :playlist="selectedPlaylist"
      :reportages="selectedPlaylist ? playlistsReportages[selectedPlaylist.id] || [] : []"
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
