<script>
import PocketBase from 'pocketbase';
import {
  fetchYouTubeVideos,
  fetchYouTubePlaylists,
  fetchLiveStream,
} from '@/services/YoutubeServices';

export default {
  data() {
    return {
      playlists: [], // Toutes les playlists (PocketBase + YouTube)
      playlistsVideos: {}, // Vidéos regroupées par playlist
      allVideos: [], // Toutes les vidéos PocketBase
      liveVideo: null, // Vidéo en live depuis YouTube
      randomVideo: null, // Vidéo aléatoire de PocketBase
      isLoading: true, // Indicateur de chargement
      errorMessage: '', // Gestion des erreurs
    };
  },

  async mounted() {
    try {
      this.isLoading = true;

      // Récupérer les données de PocketBase
      const pb = new PocketBase('http://0.0.0.0:10000');
      this.playlists = await pb.collection('playlists').getFullList();
      this.allVideos = await pb.collection('videos').getFullList(200);

      // Associer les vidéos PocketBase aux playlists
      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      // Récupérer les playlists et vidéos YouTube
      const [ytPlaylists, ytVideos] = await Promise.all([
        fetchYouTubePlaylists(),
        fetchYouTubeVideos(),
      ]);

      // Ajouter les playlists YouTube
      this.playlists = [...this.playlists, ...ytPlaylists];
      this.playlistsVideos['yt'] = ytVideos;

      // Récupérer le live YouTube
      this.liveVideo = await fetchLiveStream();

      // Si aucun live, sélectionner une vidéo aléatoire de PocketBase
      if (!this.liveVideo && this.allVideos.length > 0) {
        this.randomVideo = this.getRandomVideo();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.errorMessage = 'Une erreur est survenue lors du chargement des données.';
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    // Génère une vidéo aléatoire à partir de PocketBase
    getRandomVideo() {
      const randomIndex = Math.floor(Math.random() * this.allVideos.length);
      return this.allVideos[randomIndex];
    },
  },
};
</script>

<template>
  
    <!-- Chargement en cours -->
    <div v-if="isLoading" class="flex items-center justify-center h-screen">
      <h1 class="text-2xl font-semibold animate-pulse">Chargement...</h1>
    </div>

    <!-- Affichage des erreurs -->
    <div v-if="errorMessage" class="text-center text-red-500">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- Vidéo en direct ou vidéo aléatoire -->
    <div class="">
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
        v-if="liveVideo && liveVideo.id && liveVideo.id.videoId"
        :src="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${liveVideo.id.videoId}`"
        class="w-full h-full object-cover"
        frameborder="0"
        allow="autoplay; encrypted-media"
      ></iframe>

      <video
        v-if="randomVideo && randomVideo.id && randomVideo.VideoTele"
        :src="`http://127.0.0.1:8090/api/files/videos/${randomVideo.id}/${randomVideo.VideoTele}`"
         class="w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <div 
        class="absolute inset-x-0 bottom-0"
        style="background:linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);height:20%;"
      ></div>
      <div class="absolute inset-0 flex flex-col justify-end items-center text-center p-6 text-white">
        <h1 class="text-xl font-[400] mb-[1rem]">EN VEDETTE</h1>
        <h1 class="text-5xl font-[800] mb-[3rem]">
          {{ randomVideo ? randomVideo.title : liveVideo.snippet.title }}
        </h1>
        <p class="text-lg mb-[3rem]">
          {{ randomVideo ? randomVideo.description : liveVideo.snippet.description }}
        </p>
        <button
            v-if="liveVideo && liveVideo.id && liveVideo.id.videoId"
            :href="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${liveVideo.id.videoId}`"
            class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
        >
          Voir le direct
        </button>

        <button
            v-else-if="randomVideo && randomVideo.id"
          :to="{ name: 'singleVideoPocket', params: { id: randomVideo.id } }"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
          >
          Lecture
        </button>

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
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist-block bg-white rounded-lg shadow-md p-4"
        >
          <h3 class="text-lg font-semibold text-center mb-2">{{ playlist.title }}</h3>
          <div v-if="playlistsVideos[playlist.id]?.length">
            <div
              v-for="video in playlistsVideos[playlist.id]"
              :key="video.id"
              class="video-item flex flex-col items-center"
            >
              <h4 class="text-sm font-medium">{{ video.title }}</h4>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
              <div class="video-thumbnail mt-2">
                <video
                  :id="'video-' + video.id"
                  :src="video.videoUrl"
                  preload="metadata"
                  class="hidden"
                  @loadeddata="generateThumbnail(video)"
                ></video>
                <img :src="`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`" alt="minia">
              </div>
              </router-link>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <button class="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500">
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