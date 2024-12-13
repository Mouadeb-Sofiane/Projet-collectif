<script>
import PocketBase from 'pocketbase';
import { fetchYouTubeVideos, fetchYouTubePlaylists, fetchLiveStream } from '@/services/YoutubeServices';

export default {
  data() {
    return {
      playlists: [], // Playlists depuis YouTube
      playlistsVideos: {}, // Vidéos par playlist depuis YouTube
      allVideos: [], // Toutes les vidéos depuis PocketBase
      liveVideo: null, // Vidéo du live depuis YouTube
      randomVideo: null, // Vidéo aléatoire depuis PocketBase
      isLoading: true, // État de chargement
      errorMessage: '', // Message d'erreur
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      // Récupérer les playlists et vidéos depuis PocketBase
      const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacez par l'URL de votre instance PocketBase

      // Récupérer les playlists depuis PocketBase
      this.playlists = await pb.collection('playlists').getFullList();

      // Récupérer les vidéos pour chaque playlist
      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      // Récupérer toutes les vidéos depuis PocketBase
      this.allVideos = await pb.collection('videos').getFullList(200);

      // Récupérer les vidéos et playlists depuis YouTube
      const [ytVideos, ytPlaylists] = await Promise.all([
        fetchYouTubeVideos(), // Récupère les vidéos YouTube
        fetchYouTubePlaylists(), // Récupère les playlists YouTube
      ]);
      this.playlistsVideos['yt'] = ytPlaylists; // Stocke les playlists YouTube

      // Récupérer le live en cours sur YouTube
      this.liveVideo = await fetchLiveStream();

      // Si aucun live, sélectionne une vidéo aléatoire de PocketBase
      if (!this.liveVideo && this.allVideos.length > 0) {
        this.randomVideo = this.getRandomVideo();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.errorMessage = 'Une erreur est survenue lors du chargement des vidéos.';
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    getRandomVideo() {
      const randomIndex = Math.floor(Math.random() * this.allVideos.length);
      return this.allVideos[randomIndex];
    },
  },
};
</script>

<template>
  <div class="p-4">
    <!-- Chargement en cours -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Vidéo en direct ou vidéo aléatoire -->
    <div class="p-4">
    <!-- Chargement en cours -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Vidéo en direct ou vidéo aléatoire -->
    <div v-if="liveVideo || randomVideo" class="featured-video mb-12">
      <div class="relative w-full h-screen overflow-hidden">
        <iframe
  v-if="liveVideo"
  :src="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${liveVideo.id.videoId}`"
  class="w-full h-full object-cover"
  frameborder="0"
  allow="autoplay; encrypted-media"
></iframe>

        <video 
          v-if="randomVideo && randomVideo.VideoTele" 
          :src="`http://127.0.0.1:8090/api/files/videos/${randomVideo.id}/${randomVideo.VideoTele}`" 
          class="w-full h-full object-cover" 
          autoplay
          muted
          loop
          playsinline>
        </video>
        <div 
          class="absolute inset-x-0 bottom-0" 
          style="background:linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);height:20%;"
        ></div>
      </div>
    </div>
  </div>

    <!-- Section Vidéos -->
    <div v-if="playlistsVideos['yt'] && playlistsVideos['yt'].length">
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists YouTube</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in playlistsVideos['yt']"
          :key="playlist.id"
          class="playlist-block bg-white rounded-lg shadow-md p-4"
        >
          <div class="playlist-thumbnail">
            <img
              :src="playlist.snippet.thumbnails.medium.url"
              :alt="playlist.snippet.title"
              class="w-full rounded-lg mb-2"
            />
            <h3 class="text-lg font-semibold">{{ playlist.snippet.title }}</h3>
          </div>
          <div v-if="playlist.videos" class="space-y-4">
            <div
              v-for="video in playlist.videos"
              :key="video.id"
              class="video-item flex flex-col items-center"
            >
              <iframe
                :src="`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`"
                class="w-full h-40 object-cover rounded-md"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Playlists et vidéos PocketBase -->
    <div v-if="playlists.length && !isLoading">
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists PocketBase</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist-block bg-white rounded-lg shadow-md p-4"
        >
          <div class="playlist-thumbnail" v-if="playlist?.title">
            <img
              :src="playlist.thumbnailUrl"
              :alt="playlist.title"
              class="w-full h-40 object-cover rounded-md"
            />
            <h3 class="text-lg font-semibold mt-2 text-center">{{ playlist.title }}</h3>
          </div>
          <div v-if="playlistsVideos[playlist.id]?.length" class="mt-4 space-y-4">
            <div
              v-for="video in playlistsVideos[playlist.id]"
              :key="video.id"
              class="video-item flex flex-col items-center"
            >
              <h4 class="text-base font-medium">{{ video.title }}</h4>
              <p class="text-sm text-gray-600 text-center">{{ video.description }}</p>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <img
                  :src="video.thumbnailUrl"
                  :alt="video.title"
                  class="w-full h-32 object-cover rounded-md"
                />
                <button
                  class="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500"
                >
                  Regarder
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

video::-webkit-media-controls {
  display: none !important;
}
</style>