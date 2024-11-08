<script>
import {
  fetchYouTubeVideos,
  fetchYouTubePlaylists,
  fetchPlaylistVideos,
  fetchLiveStream, // Import du service pour récupérer le live
} from '@/services/YoutubeServices'; // Import des services

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
  <div class="home">
    <h1>Bienvenue sur ma chaîne YouTube</h1>

    <!-- Section Vidéo en vedette : Live ou vidéo aléatoire -->
    <div v-if="liveVideo || randomVideo" class="featured-video">
      <h2>{{ liveVideo ? 'Live en cours' : 'Vidéo en vedette' }}</h2>
      <iframe
        v-if="liveVideo"
        :src="`https://www.youtube.com/embed/${liveVideo.id.videoId}?autoplay=1&mute=1`"
        width="100%"
        height="500px"
        frameborder="0"
        allowfullscreen
      ></iframe>
      <iframe
        v-else
        :src="`https://www.youtube.com/embed/${randomVideo.id.videoId}?autoplay=1&mute=1`"
        width="100%"
        height="500px"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>

    <div v-if="videos.length">
      <h2>Mes autres vidéos</h2>
      <div class="videos-container">
        <div v-for="(video, index) in videos" :key="index" class="video-thumbnail">
          <h3>{{ video.snippet.title }}</h3>
          <iframe
            :src="`https://www.youtube.com/embed/${video.id.videoId}`" 
            width="100%"
            height="250px"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>

    <!-- Section Playlists avec vidéos directement chargées -->
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
              <iframe
                :src="`https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`"
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
.home {
  text-align: center;
}
.playlists-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.playlist-block {
  margin: 20px;
  width: 100%;
}
.playlist-thumbnail {
  text-align: center;
}
.playlist-videos-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.videos-container, .playlist-videos-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.video-thumbnail {
  margin: 10px;
  width: 300px;
}
h2 {
  margin-bottom: 20px;
}
</style>
