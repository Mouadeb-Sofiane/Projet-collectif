<script>
import PocketBase from "pocketbase";
import { RouterLink } from "vue-router";

export default {
  data() {
    return {
      playlists_reportages: [],  // Renommé en playlists_reportages
      playlistsReportages: {},   // Renommé en playlistsReportages
      allReportages: [],         // Renommé en allReportages
      randomReportage: null,     // Renommé en randomReportage
      isLoading: true,
      errorMessage: "",
    };
  },

  async mounted() {
    this.isLoading = true;

    try {
      const pb = new PocketBase("http://127.0.0.1:8090");

      // Récupérer les playlists de reportages depuis PocketBase
      this.playlists_reportages = await pb.collection("playlists_reportages").getFullList();
      this.allReportages = await pb.collection("reportages").getFullList(200);

      // Récupérer les reportages pour chaque playlist
      for (const playlist of this.playlists_reportages) {
        console.log("ID Playlist:", playlist.id);  // Log pour vérifier l'ID

        if (!playlist.id) {
          continue; // Si l'ID de la playlist est invalide, on ignore ce cas
        }

        // Appliquer le filtre pour récupérer les reportages de cette playlist
        const filterValue = `id_playlists_reportages~"${playlist.id}"`;

        try {
          const reportages = await pb.collection("reportages").getFullList(200, {
            filter: filterValue,
          });
          this.playlistsReportages[playlist.id] = reportages;
        } catch (err) {
          console.error(`Erreur lors de la récupération des reportages pour la playlist ${playlist.id}:`, err);
        }
      }

      // Sélectionner un reportage aléatoire
      if (this.allReportages.length > 0) {
        this.randomReportage = this.allReportages[Math.floor(Math.random() * this.allReportages.length)];
      }

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      this.errorMessage = "Une erreur est survenue lors du chargement des données.";
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<template>
  <div class="bg-black text-white relative">
    <!-- Chargement en cours -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Affichage d'un reportage aléatoire -->
    <div v-if="randomReportage && !isLoading" class="relative h-screen w-full">
      <!-- Vidéo locale -->
      <video
        v-if="randomReportage.VideoTele"
        :src="`http://127.0.0.1:8090/api/files/reportages/${randomReportage.id}/${randomReportage.VideoTele}`"
        class="w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <div
        class="absolute inset-x-0 bottom-0"
        style="background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); height: 50%;"
      ></div>

      <div
        class="hidden md:block absolute inset-y-0 left-0"
        style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); width: 50%;"
      ></div>

      <!-- Contenu textuel -->
      <div
        class="absolute inset-0 flex flex-col justify-end items-center text-center md:text-start p-6 text-white md:justify-center md:items-start md:p-12"
      >
        <h1 class="text-sm font-[400] mb-[1rem] md:text-sm md:mb-12 tracking-[0.5em]">
          REPORTAGE
        </h1>
        <h1 class="text-5xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase">
          {{ randomReportage.title }}
        </h1>
        <p class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
          {{
            randomReportage.description.length > 70
              ? randomReportage.description.slice(0, 70) + "..."
              : randomReportage.description
          }}
        </p>
        <div class="mb-10">
          <RouterLink
            :to="{ name: 'singleReportagePocket2', params: { id: randomReportage.id } }"
            class="bg-white hover:bg-gray-300 text-oranges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
          >
            LECTURE
          </RouterLink>
          <RouterLink
            :to="{ name: 'singleReportagePocket', params: { id: randomReportage.id } }"
            class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all ml-8"
          >
            PLUS D'INFO
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Message si aucun reportage n'est trouvé -->
    <div v-if="!randomReportage && !isLoading" class="text-center text-white">
      <h2>Aucun reportage disponible pour le moment.</h2>
    </div>
  </div>
</template>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
</style>
