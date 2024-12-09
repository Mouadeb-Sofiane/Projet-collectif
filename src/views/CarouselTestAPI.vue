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

    if (this.videos.length && !this.liveVideo) {
      this.randomVideo = this.getRandomVideo(); // Sélectionne une vidéo aléatoire s'il n'y a pas de live
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
  <div>
    <h1>Bienvenue sur les playlists</h1>

    <div v-if="playlists.length">
      <h2>Mes Playlists</h2>
      <div class="playlists-container">
        <div
          v-for="(playlist, index) in playlists"
          :key="index"
          class="playlist-block"
        >
          <div class="playlist-thumbnail">
            <img
              :src="playlist.snippet.thumbnails.medium.url"
              :alt="playlist.snippet.title"
            />
            <h3>{{ playlist.snippet.title }}</h3>
          </div>

          <!-- Grille des vidéos de la playlist -->
          <div class="videos-grid">
            <div
              v-for="(video, index) in playlistsVideos[playlist.id]"
              :key="index"
              class="video-card"
            >
              <h3>{{ video.snippet.title }}</h3>
              <router-link
                :to="{ name: 'singleVideo', params: { id: video.snippet.resourceId.videoId || video.id } }"
              >
                <img
                  :src="video.snippet.thumbnails.medium.url"
                  :alt="video.snippet.title"
                  class="video-image"
                />
              </router-link>
              <router-link
                :to="{ name: 'singleVideo', params: { id: video.snippet.resourceId.videoId || video.id } }"
              >
                <button>Regarder</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.playlists-container {
  padding: 0 5%;
}

.playlist-block {
  margin-bottom: 40px;
}

.videos-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Espacement entre les vidéos */
}

.video-card {
  width: calc(33.333% - 20px); /* Affiche 3 vidéos par ligne */
  text-align: center;
}

.video-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button {
  margin-top: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
