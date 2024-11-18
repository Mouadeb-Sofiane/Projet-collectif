<script>
import PocketBase from 'pocketbase';
import {
  fetchYouTubeVideos,
  fetchYouTubePlaylists,
  fetchPlaylistVideos,
  fetchLiveStream,
} from '@/services/YoutubeServices';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      allVideos: [],
      isLoading: true,
      errorMessage: '',
      youtubeVideos: [],
      youtubePlaylists: [],
      liveVideo: null,
      randomVideo: null,
    };
  },
  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090'); // Remplacez par l'URL de votre instance PocketBase

      // Récupérer les playlists depuis PocketBase
      this.playlists = await pb.collection('playlists').getFullList();

      // Récupérer les vidéos pour chaque playlist depuis PocketBase
      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }

      // Récupérer toutes les vidéos de PocketBase
      this.allVideos = await pb.collection('videos').getFullList(200);

      // Récupérer les vidéos et playlists YouTube
      this.youtubeVideos = await fetchYouTubeVideos();
      this.youtubePlaylists = await fetchYouTubePlaylists();

      // Récupérer la vidéo en direct YouTube (si elle existe)
      this.liveVideo = await fetchLiveStream();

      // Si aucun live, sélectionner une vidéo aléatoire de PocketBase
      if (!this.liveVideo && this.allVideos.length) {
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

    <!-- Affichage de la vidéo en direct ou d'une vidéo aléatoire -->
    <div v-if="liveVideo || randomVideo" class="featured-video mb-12">
      <div class="w-full h-96 ">
        <iframe
          v-if="liveVideo"
          :src="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${liveVideo.id.videoId}`"
          class="w-full h-full"
          frameborder="0"
          allow="autoplay; encrypted-media"
        ></iframe>
        <iframe
          v-else
          :src="`https://www.youtube.com/embed/${randomVideo.id.videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${randomVideo.id.videoId}`"
          class="w-full h-full"
          frameborder="0"
          allow="autoplay; encrypted-media"
        ></iframe>
      </div>
    </div>

    <!-- Section Playlists et vidéos YouTube -->
    <div v-if="youtubePlaylists.length">
      <h2 class="text-2xl font-semibold text-center mb-6">Mes Playlists YouTube</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(playlist, index) in youtubePlaylists" :key="index" class="playlist-block bg-gray-100 rounded-lg shadow-md p-4">
          <div class="playlist-thumbnail text-center mb-4">
            <img
              :src="playlist.snippet.thumbnails.medium.url"
              :alt="playlist.snippet.title"
              class="w-full rounded-lg mb-2"
            />
            <h3 class="text-lg font-medium">{{ playlist.snippet.title }}</h3>
          </div>
          <!-- Vidéos de la playlist YouTube -->
          <div v-if="playlistsVideos[playlist.id]" class="playlist-videos-container space-y-4">
            <div v-for="(video, index) in playlistsVideos[playlist.id]" :key="index" class="video-thumbnail bg-white rounded-lg shadow p-4">
              <h3 class="text-base font-medium mb-2">{{ video.snippet.title }}</h3>
              <div class="aspect-w-16 aspect-h-9">
                <iframe
                  :src="`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`"
                  class="rounded-lg"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Vidéos PocketBase -->
    <div v-if="playlists.length">
      <h2 class="text-2xl font-semibold text-center mb-6">Mes Playlists PocketBase</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(playlist, index) in playlists" :key="index" class="playlist-block bg-gray-100 rounded-lg shadow-md p-4">
          <div class="playlist-thumbnail text-center mb-4">
            <img
              :src="playlist.thumbnailUrl"
              :alt="playlist.title"
              class="w-full rounded-lg mb-2"
            />
            <h3 class="text-lg font-medium">{{ playlist.title }}</h3>
          </div>
          <!-- Vidéos de la playlist PocketBase -->
          <div v-if="playlistsVideos[playlist.id]" class="playlist-videos-container space-y-4">
            <div v-for="(video, index) in playlistsVideos[playlist.id]" :key="index" class="video-item flex flex-col items-center">
              <h4 class="text-base font-medium">{{ video.title }}</h4>
              <p class="text-sm text-gray-600 text-center">{{ video.description }}</p>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }" class="w-full mt-2">
                <img :src="video.thumbnailUrl" :alt="video.title" class="w-full h-32 object-cover rounded-md" />
                <button class="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500">Regarder</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
