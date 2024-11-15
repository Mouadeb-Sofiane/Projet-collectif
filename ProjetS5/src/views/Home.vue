<script>
import {
  fetchYouTubeVideos,
  fetchYouTubePlaylists,
  fetchPlaylistVideos,
  fetchLiveStream,
} from '@/services/YoutubeServices';

export default {
  data() {
    return {
      videos: [],
      randomVideo: null,
      playlists: [],
      playlistsVideos: {}, // Object pour stocker les vidéos de chaque playlist
      liveVideo: null, // Stocke la vidéo du live s'il y en a un
    };
  },
  async mounted() {
    this.liveVideo = await fetchLiveStream(); // Vérifie s'il y a un live en cours
    this.videos = await fetchYouTubeVideos(); // Récupère les vidéos de la chaîne
    this.playlists = await fetchYouTubePlaylists(); // Récupère les playlists de la chaîne

    // Charge automatiquement les vidéos de toutes les playlists
    for (const playlist of this.playlists) {
      const videos = await fetchPlaylistVideos(playlist.id); // Récupère les vidéos de chaque playlist
      this.playlistsVideos[playlist.id] = videos; // Assigne les vidéos à l'ID de la playlist
    }

    // Sélectionne une vidéo en vedette uniquement si aucun live n'est en cours
    if (!this.liveVideo && this.videos.length) {
      this.randomVideo = this.getRandomVideo();
    }
  },
  methods: {
    getRandomVideo() {
      const randomIndex = Math.floor(Math.random() * this.videos.length);
      return this.videos[randomIndex];
    },
  },
};
</script>
<template>
  <div class="home px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">Bienvenue sur ma chaîne YouTube</h1>

    <!-- Section Vidéo en vedette : Live en priorité, sinon vidéo aléatoire -->
    <div v-if="liveVideo || randomVideo" class="featured-video mb-12">
      <h2 class="text-2xl font-semibold text-center mb-4">
        {{ liveVideo ? 'Live en cours' : 'Vidéo en vedette' }}
      </h2>
      <div class="aspect-w-16 aspect-h-9 mx-auto max-w-4xl">
        <iframe
          v-if="liveVideo"
          :src="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1`"
          class="rounded-lg"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <iframe
          v-else
          :src="`https://www.youtube.com/embed/${randomVideo.id.videoId}?autoplay=1&mute=1`"
          class="rounded-lg"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <!-- Section Vidéos -->
    <div v-if="videos.length" class="mb-12">
      <h2 class="text-2xl font-semibold text-center mb-6">Mes autres vidéos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(video, index) in videos"
          :key="index"
          class="video-thumbnail bg-gray-100 rounded-lg shadow-md p-4"
        >
          <h3 class="text-lg font-medium mb-2">{{ video.snippet.title }}</h3>
          <div class="aspect-w-16 aspect-h-9">
            <iframe
              :src="`https://www.youtube.com/embed/${video.id.videoId}`"
              class="rounded-lg"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Playlists -->
    <div v-if="playlists.length">
      <h2 class="text-2xl font-semibold text-center mb-6">Mes Playlists</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="(playlist, index) in playlists"
          :key="index"
          class="playlist-block bg-gray-100 rounded-lg shadow-md p-4"
        >
          <div class="playlist-thumbnail text-center mb-4">
            <img
              :src="playlist.snippet.thumbnails.medium.url"
              :alt="playlist.snippet.title"
              class="w-full rounded-lg mb-2"
            />
            <h3 class="text-lg font-medium">{{ playlist.snippet.title }}</h3>
          </div>
          <!-- Vidéos de la playlist -->
          <div v-if="playlistsVideos[playlist.id]" class="playlist-videos-container space-y-4">
            <div
              v-for="(video, index) in playlistsVideos[playlist.id]"
              :key="index"
              class="video-thumbnail bg-white rounded-lg shadow p-4"
            >
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
  </div>
</template>
