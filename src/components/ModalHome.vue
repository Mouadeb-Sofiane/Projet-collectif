<script setup lang="ts">
import { ref, reactive, onMounted, watch, onUnmounted } from 'vue';
import PocketBase from 'pocketbase';
import PlaylistModal from './PlaylistModal.vue';

// Interfaces
interface Playlist {
  id: string;
  title: string;
  thumbnailurl: string | null;
  description?: string;
  date?: string;
}

interface Video {
  id: string;
  title: string;
  VideoTele: string | null;
  videoId?: string;
  description?: string;
  duree?: string;
  date?: string;
}

// Données réactives
const selectedPlaylist = ref<Playlist | null>(null);
const playlistsVideos = reactive<Record<string, Video[]>>({});
const isLoading = ref<boolean>(false);
const errorMessage = ref<string>('');
const isModalOpen = ref<boolean>(false);

// Watch pour la gestion du scroll
watch(isModalOpen, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : '';
});

// PocketBase instance
const pb = new PocketBase('http://127.0.0.1:8090');

// Charger les playlists et sélectionner une playlist aléatoire
const loadPlaylists = async (): Promise<void> => {
  isLoading.value = true;

  try {
    const playlists = await pb.collection('playlists').getFullList<Playlist>();

    if (playlists.length > 0) {
      const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];

      const videos = await pb.collection('videos').getFullList<Video>(1, {
        filter: `id_playlists~"${randomPlaylist.id}"`,
      });

      randomPlaylist.thumbnailurl = videos.length > 0 && videos[0].videoId
        ? `https://img.youtube.com/vi/${videos[0].videoId}/sddefault.jpg`
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

// Charger les vidéos d'une playlist
const loadPlaylistVideos = async (playlist: Playlist): Promise<void> => {
  if (!playlistsVideos[playlist.id]?.length) {
    isLoading.value = true;

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
const openModal = (): void => {
  if (selectedPlaylist.value) {
    loadPlaylistVideos(selectedPlaylist.value);
    isModalOpen.value = true;
  }
};

const closeModal = (): void => {
  isModalOpen.value = false;
};

// Gestionnaire de touche Escape
const handleKeyDown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeModal();
  }
};

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

// Modifiez le watch pour isModalOpen
watch(isModalOpen, (newValue) => {
  if (newValue) {
    const scrollbarWidth = getScrollbarWidth();
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    document.body.classList.add('modal-open', 'modal-open-overflow');
  } else {
    document.body.classList.remove('modal-open', 'modal-open-overflow');
  }
});

// Assurez-vous de nettoyer lors du démontage du composant
onUnmounted(() => {
  document.body.classList.remove('modal-open', 'modal-open-overflow');
  document.body.style.removeProperty('--scrollbar-width');
});

// Cycle de vie
onMounted(() => {
  loadPlaylists();
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});
</script>


<template>
  <div class="relative bg-thirdColor mt-14 text-white p-6 w-full px-12">
    <!-- Section "À la une" -->
    <h2 class="text-2xl md:text-3xl font-bold my-6">À la une</h2>
    <div class="relative mb-8 mr-12">
      <div class="h-1.5 w-[75%] md:w-[50%] lg:w-[25%] bg-primaryColor"></div>
    </div>

    <!-- Bannière de la playlist -->
    <div v-if="selectedPlaylist && !isLoading" class="banner relative w-full overflow-hidden h-[22.5rem] sm:h-[14rem] md:h-[18rem] lg:h-[23rem]">
      <img
        v-if="selectedPlaylist.thumbnailurl"
        :src="selectedPlaylist.thumbnailurl"
        :alt="selectedPlaylist.title"
        class="w-full h-full object-cover"
      />
      <div class="absolute bottom-0 flex w-full flex-col px-4 pb-4 sm:bottom-auto sm:left-8 sm:top-1/2 sm:max-w-[320px] sm:-translate-y-1/2 sm:px-0 sm:pb-0 lg:left-10 lg:max-w-[400px] gap-y-3 lg:gap-y-4">
        <!-- Logo SVG -->
        <div class="relative">
          <svg
      id="Calque_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 253.04"
      class="h-[4.5rem] sm:h-[4rem] md:h-[5rem] lg:h-[7.5rem]"
    >
      <g>
        <path fill="#1d1d1b" d="M54.33,62.92v190.14H0V62.92h54.33Z" />
        <path
          fill="#1d1d1b"
          d="M118.83,62.9v95.07c0,27.16,9.05,40.74,27.16,40.74s27.16-13.58,27.16-40.74V62.9h54.33v95.07c0,63.38-27.16,95.07-81.49,95.07s-81.49-31.69-81.49-95.07V62.9h54.33Z"
        />
      </g>
      <rect fill="#1d1d1b" x="0" y="0" width="54.33" height="54.33" rx="27.16" />
      <path
        fill="#1d1d1b"
        d="M500,62.9l-61.71,190.14h-74.42l-61.71-190.14h61.19l37.86,130.79,37.6-130.79h61.19Z"
      />
      <path fill="#f6a35d" d="M291.98,17.49v235.55h-54.33V17.49h54.33Z" />
      <path fill="#f6a35d" d="M64.5-.02h435.5v54.33H64.5V-.02Z" />
    </svg>
        </div>
        
        <h2 class="font-sans font-semibold tracking-[0.02em] text-[0.875rem] leading-[1.125rem] sm:text-[1rem] sm:leading-[1.375rem] lg:text-[1.4375rem] lg:leading-[1.75rem]">
          {{ selectedPlaylist?.title }}
        </h2>

        <button
          class="bg-primaryColor text-white focus-visible:outline-selected flex items-center justify-center whitespace-nowrap duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-max rounded-3px px-4 gap-x-1 action-1 h-10 text-brand"
          @click="openModal"
        >
          Lecture
        </button>
      </div>
    </div>

    <!-- Modal Component -->
    <PlaylistModal
      v-if="selectedPlaylist"
      :is-open="isModalOpen"
      :playlist="selectedPlaylist"
      :videos="playlistsVideos[selectedPlaylist.id] || []"
      :on-close="closeModal"
    />
  </div>
</template>