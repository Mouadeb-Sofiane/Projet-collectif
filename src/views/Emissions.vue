<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      selectedPlaylist: null,
      selectedVideo: null,
      isLoading: true,
      errorMessage: '',
    };
  },

  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      // Récupération des playlists
      this.playlists = await pb.collection('playlists').getFullList();

      // Initialisation des vidéos par playlist
      this.playlists.forEach((playlist) => {
        this.playlistsVideos[playlist.id] = [];
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
      this.errorMessage = 'Impossible de charger les playlists.';
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    async selectPlaylist(playlist) {
      this.selectedPlaylist = playlist;

      if (!this.playlistsVideos[playlist.id].length) {
        try {
          const pb = new PocketBase('http://127.0.0.1:8090');
          const videos = await pb.collection('videos').getFullList(200, {
            filter: `id_playlists~"${playlist.id}"`,
          });

          this.playlistsVideos[playlist.id] = videos;
        } catch (error) {
          console.error('Erreur lors du chargement des vidéos :', error);
          this.errorMessage = `Impossible de charger les vidéos pour la playlist ${playlist.title}.`;
        }
      }
    },

    openModal(video) {
      this.selectedVideo = video;
    },

    closeModal() {
      this.selectedVideo = null;
    },
  },
};
</script>

<template>
  <div>
    <!-- Playlists -->
    <div v-if="playlists.length && !isLoading" class="playlists p-6">
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist bg-gray-800 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700"
          @click="selectPlaylist(playlist)"
        >
          <h3 class="text-lg font-bold text-center">{{ playlist.title }}</h3>
          
        </div>
      </div>
    </div>

    <!-- Vidéos -->
    <div v-if="selectedPlaylist" class="videos p-6 bg-gray-900 text-white mt-6">
      <h3 class="text-2xl font-bold text-center mb-4">
        Vidéos de la playlist : {{ selectedPlaylist.title }}
      </h3>
      <div
        v-if="playlistsVideos[selectedPlaylist.id]?.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div v-for="video in playlistsVideos[selectedPlaylist.id]" :key="video.id" class="video-item">
          <img
            v-if="video.thumbnail"
            :src="video.thumbnail"
            class="w-full h-48 object-cover rounded-lg"
            @click="openModal(video)"
            alt="Thumbnail"
          />
          <h4 class="text-center mt-2">{{ video.title }}</h4>
          <button
            class="bg-blue-500 text-white py-2 px-4 rounded mt-2"
            @click="openModal(video)"
          >
            Regarder
          </button>
        </div>
      </div>
      <p v-else class="text-center text-gray-400">Aucune vidéo disponible.</p>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedVideo"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          @click="closeModal"
        >
          ✕
        </button>
        <video
          v-if="selectedVideo.VideoTele"
          :src="`http://127.0.0.1:8090/api/files/videos/${selectedVideo.id}/${selectedVideo.VideoTele}`"
          class="w-full h-auto rounded-lg"
          controls
          autoplay
        ></video>
        <p class="text-center mt-4 font-bold text-lg">{{ selectedVideo.title }}</p>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="text-red-500 text-center mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>
