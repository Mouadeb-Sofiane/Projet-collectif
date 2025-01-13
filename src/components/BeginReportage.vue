<script>
import PocketBase from "pocketbase";
import { RouterLink } from "vue-router";

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      allVideos: [],
      randomVideo: null, // Une seule vidéo aléatoire
      isLoading: true,
      errorMessage: "",
    };
  },

  async mounted() {
    this.isLoading = true;

    try {
      const pb = new PocketBase("http://127.0.0.1:8090");

      // Récupérer les playlists et vidéos depuis PocketBase
      this.playlists = await pb.collection("playlists").getFullList();
      this.allVideos = await pb.collection("videos").getFullList(200);

      // Récupération des vidéos par playlist
      for (const playlist of this.playlists) {
        const videos = await pb.collection("videos").getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      // Sélectionner une vidéo aléatoire
      if (this.allVideos.length > 0) {
        this.randomVideo =
          this.allVideos[Math.floor(Math.random() * this.allVideos.length)];
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      this.errorMessage =
        "Une erreur est survenue lors du chargement des données.";
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

    <!-- Affichage d'une vidéo aléatoire -->
    <div v-if="randomVideo && !isLoading" class="relative h-screen w-full">
      <!-- Vidéo locale -->
      <video
        v-if="randomVideo.VideoTele"
        :src="`http://127.0.0.1:8090/api/files/videos/${randomVideo.id}/${randomVideo.VideoTele}`"
        class="w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <div
        class="absolute inset-x-0 bottom-0"
        style="
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0) 100%
          );
          height: 50%;
        "
      ></div>

      <div
        class="hidden md:block absolute inset-y-0 left-0"
        style="
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0) 100%
          );
          width: 50%;
        "
      ></div>

      <!-- Contenu textuel -->
      <div
        class="absolute inset-0 flex flex-col justify-end items-center text-center md:text-start p-6 text-white md:justify-center md:items-start md:p-12"
      >
        <h1
          class="text-sm font-[400] mb-[1rem] md:text-sm md:mb-12 tracking-[0.5em]"
        >
          REPORTAGE
        </h1>
        <!-- Contenu textuel -->
        <h1
          class="text-5xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase"
        >
          {{ randomVideo.title }}
        </h1>
        <p class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
          {{
            randomVideo.description.length > 70
              ? randomVideo.description.slice(0, 70) + "..."
              : randomVideo.description
          }}
        </p>
        <div class="mb-10">
          <RouterLink
            :to="{ name: 'singleVideoPocket2', params: { id: randomVideo.id } }"
            class="bg-white hover:bg-gray-300 text-oranges font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
          >
            LECTURE
          </RouterLink>
          <RouterLink
            :to="{ name: 'singleVideoPocket', params: { id: randomVideo.id } }"
            class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all ml-8"
          >
            PLUS D'INFO
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Message si aucune vidéo n'est trouvée -->
    <div v-if="!randomVideo && !isLoading" class="text-center text-white">
      <h2>Aucune vidéo disponible pour le moment.</h2>
    </div>
  </div>
</template>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
</style>
