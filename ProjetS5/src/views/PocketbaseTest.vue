<template>
    <div>
      <h1>Bienvenue sur les playlists</h1>
  
      <div v-if="playlists.length">
        <h2>Mes Playlists</h2>
        <div class="playlists-container">
          <div v-for="(playlist, index) in playlists" :key="index" class="playlist-block">
            <div class="playlist-thumbnail">
              <img :src="playlist.thumbnailUrl" :alt="playlist.title" />
              <h3>{{ playlist.title }}</h3>
            </div>
  
            <!-- Carousel pour les vidéos de la playlist -->
            <Swiper :slides-per-view="3" space-between="20" navigation class="playlist-carousel">
              <SwiperSlide v-for="(video, index) in playlistsVideos[playlist.id]" :key="index" class="video-slide">
                <h3>{{ video.title }}</h3>
                <router-link :to="{ name: 'singleVideo', params: { id: video.videoId } }">
                  <img :src="video.thumbnailUrl" :alt="video.title" class="video-image" />
                </router-link>
                <router-link :to="{ name: 'singleVideo', params: { id: video.videoId } }">
                  <button>Regarder</button>
                </router-link>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import 'swiper/swiper-bundle.css';
  import { fetchPlaylists, fetchVideosByPlaylist } from '@/services/PocketBaseServices';
  
  export default {
    components: {
      Swiper,
      SwiperSlide,
    },
    data() {
      return {
        playlists: [],
        playlistsVideos: {},
        liveVideo: null,
        randomVideo: null,
      };
    },
    async mounted() {
      // Authentifiez-vous si nécessaire (ex. pour accès sécurisé)
      // Ici, nous supposons que les collections sont accessibles en lecture publique
  
      this.playlists = await fetchPlaylists();
      for (const playlist of this.playlists) {
        this.playlistsVideos[playlist.id] = await fetchVideosByPlaylist(playlist.playlistId);
      }
  
      // Gérer le live en direct avec l'API YouTube si nécessaire
    },
  };
  </script>
  
  <style scoped>
  .playlists-container {
    padding: 0 5%;
  }
  
  .playlist-block {
    margin-bottom: 40px;
  }
  
  .playlist-carousel {
    margin-top: 20px;
    position: relative;
  }
  
  /* Positionne les flèches en dehors des vidéos et vers les bords de l'écran */
  .swiper-button-next, .swiper-button-prev {
    color: #333; /* Personnalisation de la couleur */
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
  
  .swiper-button-prev {
    left: -40px; /* Place la flèche de gauche en dehors du conteneur, vers le bord gauche */
  }
  
  .swiper-button-next {
    right: -40px; /* Place la flèche de droite en dehors du conteneur, vers le bord droit */
  }
  
  .video-slide {
    text-align: center;
  }
  
  .video-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  </style>
  