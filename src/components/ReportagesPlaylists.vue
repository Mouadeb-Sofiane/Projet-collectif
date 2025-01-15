<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PocketBase from "pocketbase";
import VideoReportages from "./VideoReportages.vue";

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
  videoId?: string;
  description?: string;
  duree?: string;
  date?: string;
};

// Données réactives
const playlists_reportages = ref<Playlist[]>([]);
const playlistsReportages = reactive<Record<string, Reportage[]>>({});
const isLoading = ref(true);
const errorMessage = ref("");

// Charger les playlists et reportages lors du montage
onMounted(async () => {
  isLoading.value = true;
  try {
    const pb = new PocketBase("http://127.0.0.1:8090");

    // Récupérer les playlists
    const fetchedPlaylists = await pb.collection("playlists_reportages").getFullList<Playlist>();
    playlists_reportages.value = fetchedPlaylists;

    // Charger les reportages pour chaque playlist
    for (const playlist of fetchedPlaylists) {
      const reportages = await pb.collection("reportages").getFullList<Reportage>(200, {
        filter: `id_playlists_reportages~"${playlist.id}"`,
      });
      playlistsReportages[playlist.id] = reportages;
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
    errorMessage.value = "Impossible de charger les playlists. Veuillez réessayer plus tard.";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="w-full">
    <!-- Affichage des playlists -->
    <div v-if="isLoading" class="flex justify-center items-center p-12">
      <p class="text-lg text-gray-600">Chargement...</p>
    </div>

    <!-- Message d'erreur -->
    <p v-else-if="errorMessage" class="text-red-500 text-center p-4">{{ errorMessage }}</p>

    <!-- Playlists Grid -->
    <div v-else class="space-y-16">
      <div v-for="playlist in playlists_reportages" :key="playlist.id" class="carousel-container relative bg-thirdColor text-white p-6 w-full px-12">
        <!-- Section titre avec surlignement -->
        <h2 class="text-2xl md:text-3xl font-bold my-6">{{ playlist.title }}</h2>
        <div class="relative mb-8 mr-12">
          <div class="h-1.5 w-[75%] md:w-[50%] lg:w-[25%] bg-primaryColor"></div>
        </div>
        
        <!-- Composant VideoPlaylist -->
        <VideoReportages
          :reportages="playlistsReportages[playlist.id]"
        />
      </div>
    </div>
  </div>
</template>
