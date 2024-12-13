<script>
import PocketBase from 'pocketbase';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      selectedPlaylist: null,
      isLoading: true,
      errorMessage: '',
    };
  },

  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      // Récupération des playlists
      const playlists = await pb.collection('playlists').getFullList();

      // Pour chaque playlist, récupérer la première vidéo associée et définir une miniature
      const updatedPlaylists = await Promise.all(
        playlists.map(async (playlist) => {
          try {
            // Récupérer uniquement la première vidéo associée à la playlist
            const videos = await pb.collection('videos').getFullList(1, {
              filter: `id_playlists~"${playlist.id}"`,
            });

            // Associer une vignette de vidéo si disponible
            if (videos.length > 0) {
              const video = videos[0]; // Utiliser la première vidéo associée
              if (video.videoId) {
                playlist.thumbnailurl = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`; // Créer la vignette YouTube
              } else {
                playlist.thumbnailurl = null; // Pas de vignette si vidéo sans videoId
              }
            } else {
              playlist.thumbnailurl = null; // Pas de vidéo associée, donc pas de vignette
            }
          } catch (error) {
            console.error(`Erreur lors du chargement des vidéos pour la playlist ${playlist.id}:`, error);
            playlist.thumbnailurl = null; // Pas de vignette en cas d'erreur
          }
          return playlist;
        })
      );

      this.playlists = updatedPlaylists;
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

      // Si les vidéos ne sont pas encore chargées pour la playlist, on les charge
      if (!this.playlistsVideos[playlist.id]?.length) {
        try {
          const pb = new PocketBase('http://127.0.0.1:8090');
          const videos = await pb.collection('videos').getFullList(200, {
            filter: `id_playlists~"${playlist.id}"`,
          });

          // On stocke les vidéos de cette playlist
          this.playlistsVideos[playlist.id] = videos;
        } catch (error) {
          console.error('Erreur lors du chargement des vidéos pour la playlist:', error);
          this.errorMessage = `Impossible de charger les vidéos pour la playlist ${playlist.title}.`;
        }
      }
    },

    closeModal() {
      this.selectedPlaylist = null;
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
          <img
            v-if="playlist.thumbnailurl"
            :src="playlist.thumbnailurl"
            alt="Vignette de la playlist"
            class="w-full h-40 object-cover rounded-t-lg"
          />
          <p v-else class="text-center text-gray-400">Aucune vignette disponible</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedPlaylist"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @keydown.esc="closeModal"
      tabindex="0"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-4xl w-full p-4 relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          @click="closeModal"
        >
          ✕
        </button>

        <div>
          <h2 class="text-center text-2xl font-bold mb-4">
            Vidéos de la playlist : {{ selectedPlaylist.title }}
          </h2>
          <div
            v-if="playlistsVideos[selectedPlaylist.id]?.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="video in playlistsVideos[selectedPlaylist.id]"
              :key="video.id"
              class="video-item bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h4 class="text-center mt-2">{{ video.title }}</h4>
              <video
                :src="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`"
                class="w-full mt-2 rounded-lg"
                controls
              ></video>
            </div>
          </div>
          <p v-else class="text-center text-gray-400">
            Aucune vidéo disponible pour cette playlist.
          </p>
        </div>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-if="errorMessage" class="text-red-500 text-center mt-4">
      {{ errorMessage }}
    </div>
  </div>
</template>
