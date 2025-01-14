<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import PocketBase from "pocketbase";

// Types
type Playlist = {
  id: string;
  title: string;
  thumbnailurl: string | null;
  description?: string;
  date?: string;
};

type Video = {
  id: string;
  title: string;
  videoId?: string;
  description?: string;
  duree?: string;
  date?: string;
};

// Données réactives
const playlists = ref<Playlist[]>([]);
const playlistsVideos = reactive<Record<string, Video[]>>({});
const isLoading = ref(true);
const errorMessage = ref("");
const currentIndex = reactive<Record<string, number>>({});
const itemWidth = ref(0);
const visibleItems = ref(4);

// Charger les playlists et vidéos lors du montage
onMounted(async () => {
  isLoading.value = true;
  try {
    const pb = new PocketBase("http://127.0.0.1:8090");

    // Récupérer les playlists
    const fetchedPlaylists = await pb.collection("playlists").getFullList<Playlist>();
    playlists.value = fetchedPlaylists;

    // Charger les vidéos pour chaque playlist
    for (const playlist of fetchedPlaylists) {
      const videos = await pb.collection("videos").getFullList<Video>(200, {
        filter: `id_playlists~"${playlist.id}"`,
      });

      playlistsVideos[playlist.id] = videos;
      currentIndex[playlist.id] = 0;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    errorMessage.value = "Impossible de charger les playlists.";
  } finally {
    isLoading.value = false;
  }
});

// Calculer le nombre d'éléments visibles
const calculateVisibleItems = () => {
  const width = window.innerWidth;
  if (width < 640) {
    visibleItems.value = 1;
  } else if (width < 1024) {
    visibleItems.value = 2;
  } else {
    visibleItems.value = 4;
  }
  itemWidth.value = document.querySelector(".carousel-track")?.clientWidth / visibleItems.value || 0;
};

// Définir les fonctions de défilement du carrousel
const scrollNext = (playlistId: string) => {
  if (currentIndex[playlistId] + visibleItems.value < (playlistsVideos[playlistId]?.length || 0)) {
    currentIndex[playlistId] += visibleItems.value;
  }
};

const scrollPrev = (playlistId: string) => {
  if (currentIndex[playlistId] > 0) {
    currentIndex[playlistId] -= visibleItems.value;
  }
};

// Gestion de la redimension du carrousel
onMounted(() => {
  calculateVisibleItems();
  window.addEventListener("resize", calculateVisibleItems);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", calculateVisibleItems);
});
</script>
<template>
  <div class="bg-black">
    <!-- Playlists Grid -->
    <div v-if="playlists.length && !isLoading" class="space-y-8 px-4 mx-auto max-w-[2000px]">
      <div v-for="playlist in playlists" :key="playlist.id">
        <!-- Playlist Title -->
        <h2 class="text-white text-2xl font-bold mb-4 text-center">{{ playlist.title }}</h2>

        <!-- Carrousel des vidéos -->
        <div class="carousel relative overflow-hidden w-full">
          <!-- Liste des vignettes -->
          <div
            class="carousel-track flex transition-transform duration-700 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex[playlist.id] * itemWidth.value}px)` }"
          >
            <div
              v-for="video in playlistsVideos[playlist.id]"
              :key="video.id"
              class="carousel-item flex-shrink-0"
              :style="{ width: `${itemWidth.value}px` }"
            >
              <div class="rounded-lg shadow-md">
                <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                  <img :src="`https://img.youtube.com/vi/${video.videoId}/sddefault.jpg`" alt="Vignette de la vidéo" class="w-full h-full object-cover" />
                </router-link>
                <div class="p-4">
                  <h3 class="md:text-xl font-bold truncate">{{ video.title }}</h3>
                  <h3 class="mt-1 font-light text-sm truncate line-clamp-2">{{ video.description }}</h3>
                </div>
              </div>
            </div>
          </div>

          <!-- Flèches navigation -->
          <button
            v-if="currentIndex[playlist.id] > 0"
            @click="scrollPrev(playlist.id)"
            class="absolute top-1/2 left-[-0.3rem] transform -translate-y-1/2 w-12 h-[18rem] flex items-center justify-center text-white hover:bg-opacity-80"
            style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
          >
            <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4205 15.4797L2.88369 27.8639L0 24.7684L10.0949 13.932L0 3.09551L2.88369 0L14.4205 12.3842C14.8028 12.7947 15.0176 13.3515 15.0176 13.932C15.0176 14.5125 14.8028 15.0692 14.4205 15.4797Z" fill="white" />
            </svg>
          </button>

          <button
            v-if="currentIndex[playlist.id] + visibleItems.value < playlistsVideos[playlist.id]?.length"
            @click="scrollNext(playlist.id)"
            class="absolute top-1/2 right-[-0.3rem] transform -translate-y-1/2 w-12 h-[18rem] flex items-center justify-center text-white hover:bg-opacity-80"
            style="background: linear-gradient(to left, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);"
          >
            <svg width="16" height="28" viewBox="0 0 16 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4205 15.4797L2.88369 27.8639L0 24.7684L10.0949 13.932L0 3.09551L2.88369 0L14.4205 12.3842C14.8028 12.7947 15.0176 13.3515 15.0176 13.932C15.0176 14.5125 14.8028 15.0692 14.4205 15.4797Z" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>

    <!-- Message de chargement -->
    <div v-if="isLoading" class="flex justify-center mt-8">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" width="40" height="40" class="animate-spin">
        <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="10" fill="none" />
      </svg>
    </div>
  </div>
</template>
<style scoped>
.carousel-item {
  max-width: 300px;
  margin: 0 10px;
}
</style>