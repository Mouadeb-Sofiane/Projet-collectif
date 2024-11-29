<script>
import {
  fetchYouTubeVideos,
  fetchYouTubePlaylists,
  fetchPlaylistVideos,
  fetchLiveStream,
} from '@/services/YoutubeServices';
import { RouterLink } from 'vue-router';

export default {
  data() {
    return {
      videos: [],
      randomVideo: null,
      playlists: [],
      playlistsVideos: {},
      liveVideo: null,
      currentPlaylistIndex: 0,
      currentVideoIndex: 0,
    };
  },
  async mounted() {
  try {
    this.liveVideo = await fetchLiveStream();
    this.videos = await fetchYouTubeVideos();
    this.playlists = await fetchYouTubePlaylists();

    for (const playlist of this.playlists) {
      const videos = await fetchPlaylistVideos(playlist.id);
      this.playlistsVideos[playlist.id] = videos;
      console.log(`Videos for playlist ${playlist.id}:`, videos); // Vérification des vidéos
    }

    if (this.videos.length && !this.liveVideo) {
      this.randomVideo = this.getRandomVideo();
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
},
  methods: {
    getRandomVideo() {
      const randomIndex = Math.floor(Math.random() * this.videos.length);
      return this.videos[randomIndex];
    },
    nextVideo() {
        const currentPlaylist = this.playlists[this.currentPlaylistIndex];
            if (this.playlistsVideos[currentPlaylist.id]) {
            const videos = this.playlistsVideos[currentPlaylist.id];
            if (videos.length > 0) {
                this.currentVideoIndex = (this.currentVideoIndex + 1) % videos.length;
            }
        }
    },
    prevVideo() {
        const currentPlaylist = this.playlists[this.currentPlaylistIndex];
            if (this.playlistsVideos[currentPlaylist.id]) {
            const videos = this.playlistsVideos[currentPlaylist.id];
            if (videos.length > 0) {
                this.currentVideoIndex = (this.currentVideoIndex - 1 + videos.length) % videos.length;
            }
        }
    },
    nextPlaylist() {
      this.currentPlaylistIndex = (this.currentPlaylistIndex + 1) % this.playlists.length;
      this.currentVideoIndex = 0;
    },
    prevPlaylist() {
      this.currentPlaylistIndex = (this.currentPlaylistIndex - 1 + this.playlists.length) % this.playlists.length;
      this.currentVideoIndex = 0;
    },
  },
};
</script>

<template>
    <div v-if="playlists.length > 0">
      <div class="slider" v-if="playlistsVideos[playlists[currentPlaylistIndex]?.id]?.length > 0">
        <div class="list">
          <div class="item active" v-if="playlistsVideos[playlists[currentPlaylistIndex]?.id][currentVideoIndex]">
            <img :src="playlistsVideos[playlists[currentPlaylistIndex]?.id]?.[currentVideoIndex]?.snippet?.thumbnails?.medium?.url" alt="Miniature de la vidéo" class="video-thumbnail" />
            <div class="content">
                <p>{{ playlists[currentPlaylistIndex].snippet.title }}</p>
                <h2>{{ playlistsVideos[playlists[currentPlaylistIndex]?.id][currentVideoIndex]?.snippet.title }}</h2>
                <p>{{ playlistsVideos[playlists[currentPlaylistIndex]?.id][currentVideoIndex]?.snippet.description }}</p>
                <div class="button-container">
                    
                    <button class="lecture">Lecture</button>
                    <button class="plus-infos">Plus d'infos</button>
                </div>
            </div>
            
            <iframe
              :src="'https://www.youtube.com/embed/' + (playlistsVideos[playlists[currentPlaylistIndex]?.id][currentVideoIndex].snippet?.resourceId?.videoId || playlistsVideos[playlists[currentPlaylistIndex]?.id][currentVideoIndex].id)"
              width="100%"
              height="200px"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
        <div class="arrows">
            <button @click="prevVideo" class="prev"><</button>
            <button @click="nextVideo" class="next">></button>
        </div>
      </div>
  
      <div class="thumbnail">
        <div v-for="(video, index) in playlistsVideos[playlists[currentPlaylistIndex]?.id]" :key="index" class="item" @click="currentVideoIndex = index">
          <img :src="video.snippet.thumbnails.medium.url" alt="Thumbnail" />
          <div class="content">
            <p>{{ video.snippet.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
<style>
.content {
    color: #fff;
}
.slider {
    height: 100vh;
    position: relative;
}
.slider .list .item{
    position: absolute;
    inset: 0 0 0 0;
    overflow: hidden;
    opacity: 0;
    transition: 0.5s;
}
.slider .list .item img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.slider .list .item::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-image: linear-gradient(
        to top, #000 40%, transparent 100%
    );
}
.slider .list .item .content {
    position: absolute;
    left: 10%;
    top: 5%;
    width: 500px;
    max-width: 80%;
    z-index: 1;
}
.slider .list .item .content p:nth-child(1) {
    text-transform: uppercase;
    letter-spacing: 10px;
}
.slider .list .item .content h2 {
    font-size: 42px;
    margin: 0;
}
.slider .list .item.active {
    opacity: 1;
    z-index: 10;
}
@keyframes ShowContent {
    to {
        transform: translateY(0);
        filter: blur(0);
        opacity: 1;
    }
    
}
.slider .list .item.active p:nth-child(1),
.slider .list .item.active h2,
.slider .list .item.active p:nth-child(3) {
    transform: translateY(30px);
    filter: blur(20px);
    opacity: 0;
    animation: ShowContent .5s .7s ease-in-out 1 forwards;
}
.slider .list .item.active h2 {
    animation-delay: 1s;
}
.slider .list .item.active p:nth-child(3) {
    animation-delay: 1.3s;
}
.arrows {
    position: absolute;
    top: 30%;
    right: 50px;
    z-index: 100;
}
.arrows button {
    background-color: #eee5;
    border: none;
    font-family: monospace;
    width: 40px;
    height: 40px;
    border-radius: 5px;
    font-size: x-large;
    color: #eee;
    transition: .5s;
    }
.arrows button:hover {
    background-color: #000;
    color: #eee;
}
.thumbnail {
    position: absolute;
    bottom: 50px;
    z-index: 11;
    display: flex;
    gap: 10px;
    width: 100%;
    height: 250px;
    padding: 0 50px;
    box-sizing: border-box;
    overflow: auto;
    justify-content: center;
}
.thumbnail::-webkit-scrollbar {
    width: 0;
}
.thumbnail .item {
    width: 150px;
    height: 220px;
    filter: brightness(.5);
    flex-shrink: 0;
}
.thumbnail .item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}
.thumbnail .item.active {
    filter: brightness(1.5);
}
.thumbnail .item .content {
    position: absolute;
    inset: auto 10px 10px 10px;
}
@media screen and (max-width: 768px) {
    .thumbnail {
        justify-content: start;
    }
    .slider .list .item .content h2 {
        font-size: 60px;
    }
    .arrows {
        top: 10%;
    }
}
.button-container {
    display: flex; /* Utilisation de flexbox pour aligner les boutons */
    gap: 10px; /* Espacement entre les boutons */
}
.lecture {
    background-color: #FFFFFF; /* Couleur de fond */
    color: #E57700; /* Couleur du texte */
    border: none; /* Pas de bordure */
    border-radius: 5px; /* Coins arrondis */
    padding: 10px 20px; /* Espacement intérieur */
    font-size: 16px; /* Taille de la police */
    cursor: pointer; /* Curseur de pointeur */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Animation lors du survol */
}
.lecture:hover {
    background-color: #d1d1d1; /* Couleur de fond au survol */
    transform: translateY(-2px); /* Léger déplacement vers le haut */
}

.lecture:active {
    transform: translateY(0); /* Rétablissement lors du clic */
}
.plus-infos {
    background-color: #2A2A2A; /* Couleur de fond du deuxième bouton */
    color: white; /* Couleur du texte */
    border: 1px solid white; /* Bordure blanche */
    padding: 10px 20px; /* Espacement intérieur */
    font-size: 16px; /* Taille de la police */
    cursor: pointer; /* Curseur de pointeur */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Animation lors du survol */
}

.plus-infos:hover {
    background-color: #454545; /* Couleur de fond au survol */
    transform: translateY(-2px); /* Léger déplacement vers le haut */
}

.plus-infos:active {
    transform: translateY(0); /* Rétablissement lors du clic */
}
</style>
  