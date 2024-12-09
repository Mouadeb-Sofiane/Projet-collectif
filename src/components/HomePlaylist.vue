<script>
import PocketBase from 'pocketbase';
import { fetchYouTubePlaylists, fetchYouTubeVideos, fetchLiveStream } from '@/services/YoutubeServices';

export default {
  data() {
    return {
      playlists: [],
      playlistsVideos: {},
      allVideos: [],
      liveVideo: null,
      sliderVideos: [],
      currentVideoIndex: 0,
      sliderInterval: null,
      progressInterval: null,
      progressPercentage: 0,
      isLoading: true,
      errorMessage: '',
      cache: {
        playlists: null,
        videos: null,
        lastYouTubeFetch: 0,
      },
    };
  },

  async mounted() {
    this.isLoading = true;
    try {
      const pb = new PocketBase('http://127.0.0.1:8090');

      // Chargement des playlists et vidéos depuis PocketBase
      await this.loadCachedData(pb);

      // Mise à jour des données depuis l'API YouTube
      await this.updateYouTubeData();

      // Chargement de la vidéo en direct
      this.liveVideo = await fetchLiveStream();

      // Préparation des vidéos pour le slider
      this.prepareSliderVideos();

      // Capture des miniatures personnalisées pour les vidéos locales
      await this.generateCustomThumbnails();

      // Démarrage du slider
      this.startSlider();
    } catch (error) {
      console.error('Erreur lors du chargement des données :', error);
      this.errorMessage = 'Une erreur est survenue lors du chargement des données.';
    } finally {
      this.isLoading = false;
    }
  },

  methods: {
    async loadCachedData(pb) {
      if (!this.cache.playlists || !this.cache.videos) {
        this.cache.playlists = await pb.collection('playlists').getFullList();
        this.cache.videos = await pb.collection('videos').getFullList(200);
      }
      this.playlists = [...this.cache.playlists];
      this.allVideos = [...this.cache.videos];

      for (const playlist of this.playlists) {
        const videos = await pb.collection('videos').getFullList(200, {
          filter: `id_playlists~"${playlist.id}"`,
        });
        this.playlistsVideos[playlist.id] = videos;
      }
    },

    async updateYouTubeData() {
      const now = Date.now();
      const fifteenMinutes = 15 * 60 * 1000;

      if (now - this.cache.lastYouTubeFetch > fifteenMinutes) {
        const [ytPlaylists, ytVideos] = await Promise.all([
          fetchYouTubePlaylists(),
          fetchYouTubeVideos(),
        ]);
        this.cache.lastYouTubeFetch = now;

        this.playlists = [...this.playlists, ...ytPlaylists];
        this.playlistsVideos['yt'] = ytVideos;
      }
    },

    async generateCustomThumbnails() {
      for (const video of this.allVideos) {
        try {
          video.customThumbnail = await this.captureThumbnail(video.videoUrl);
        } catch (error) {
          console.error(`Erreur lors de la capture de la miniature pour ${video.title} :`, error);
        }
      }
    },

    captureThumbnail(videoUrl) {
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.crossOrigin = 'anonymous'; // Important pour les vidéos externes
      videoElement.currentTime = 1; // Capturer à 1 seconde

      return new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          videoElement.currentTime = 1;
        };

        videoElement.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          } catch (error) {
            reject(error);
          }
        };

        videoElement.onerror = (e) => reject(e);
      });
    },

    beforeUnmount() {
      if (this.sliderInterval) {
        clearInterval(this.sliderInterval);
      }
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
    },
  },
};
</script>
<template>
    <!-- Section Playlists et vidéos PocketBase -->
    <div v-if="playlists.length && !isLoading" class="playlists text-white bg-black p-6">
      <h2 class="text-3xl font-bold text-center my-6">Mes Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="playlist in playlists"
          :key="playlist.id"
          class="playlist bg-gray-800 p-4 rounded-lg shadow-md"
        >
        
          <h3 class="text-lg font-bold text-center">{{ playlist.title }}</h3>
          <div v-if="playlistsVideos[playlist.id]?.length">
            <div v-for="video in playlistsVideos[playlist.id]" :key="video.id" class="video-item">
              <h3 class="text-center mb-2">{{ video.title }}</h3>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <img :src="video.customThumbnail || video.thumbnailUrl" alt="Thumbnail" class="w-full rounded-md mb-2" />
              </router-link>
              <router-link :to="{ name: 'singleVideoPocket', params: { id: video.id } }">
                <button class="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Regarder
                </button>
              </router-link>
            </div>
          </div>
          <p v-else class="text-center text-gray-400">Aucune vidéo disponible.</p>
        </div>
      </div>
    </div>
  </template>
  