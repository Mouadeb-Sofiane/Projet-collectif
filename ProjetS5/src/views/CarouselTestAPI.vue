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
        <div v-for="(playlist, index) in playlists" :key="index" class="playlist-block">
          <div class="playlist-thumbnail">
            <img :src="playlist.snippet.thumbnails.medium.url" :alt="playlist.snippet.title" />
            <h3>{{ playlist.snippet.title }}</h3>
          </div>

          <!-- Affichage des vidéos de la playlist -->
          <div v-if="playlistsVideos[playlist.id]" class="playlist-videos-container">
            <div v-for="(video, index) in playlistsVideos[playlist.id]" :key="index" class="video-thumbnail">
              <h3>{{ video.snippet.title }}</h3>
              <p>{{ video.snippet.description }}</p>
              <!-- Bouton "Regarder" redirigeant vers la page singleVideo -->
              <router-link :to="{ name: 'singleVideo', params: { id: video.snippet.resourceId.videoId || video.id } }">
                <button>Regarder</button>
              </router-link>
              <!-- Vidéo YouTube en iframe -->
              <iframe
                :src="`https://www.youtube.com/embed/${video.snippet.resourceId.videoId || video.id}`"
                width="100%"
                height="200px"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.playlist-block {
  margin-bottom: 40px;
}

.playlist-videos-slider {
  position: relative;
}

.slider-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.slider-item {
  display: none;
  text-align: center;
}

button.prev,
button.next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
}

button.prev {
  left: 0;
}

button.next {
  right: 0;
}
</style>

