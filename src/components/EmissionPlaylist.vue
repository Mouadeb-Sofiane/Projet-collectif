<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PocketBase from "pocketbase";
import VideoCarrousel from "./VideoCarrousel.vue";

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
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    errorMessage.value = "Impossible de charger les playlists.";
  } finally {
    isLoading.value = false;
  }
});
</script>
<template>
  <div class="w-full">
    <!-- Playlists Grid -->
    <div v-if="playlists.length && !isLoading" class="space-y-16">
      <div v-for="playlist in playlists" :key="playlist.id" class="carousel-container relative bg-thirdColor text-white p-6 w-full px-12">
        <!-- Section titre avec surlignement -->
        <h2 class="text-2xl md:text-3xl font-bold my-6">{{ playlist.title }}</h2>
        <div class="relative mb-8 mr-12">
          <div class="h-1.5 w-[75%] md:w-[50%] lg:w-[25%] bg-primaryColor"></div>
        </div>
        
        <!-- Composant VideoPlaylist -->
        <VideoCarrousel
          :videos="playlistsVideos[playlist.id]"
        />
      </div>
    </div>

    <!-- Message d'erreur -->
    <p v-if="errorMessage" class="text-red-500 text-center p-4">{{ errorMessage }}</p>

    <!-- Message de chargement -->
    <div v-if="isLoading" class="flex justify-center items-center p-12">
      <p class="text-lg text-gray-600">Chargement...</p>
    </div>
  </div>
</template>