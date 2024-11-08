<script>
export default {
  data() {
    return {
      video: null, // Détail de la vidéo
      error: null, // Message d'erreur
    };
  },
  methods: {
    async fetchVideoDetails(videoId) {
      const apiKey = 'AIzaSyDX8BB6-H6riZiT1xDPI3juzwWRJ1bRkv8'; // Remplacez par votre clé API
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des détails de la vidéo');
        }
        
        const data = await response.json();
        
        // Vérifiez que des éléments sont présents
        if (data.items && data.items.length > 0) {
          this.video = data.items[0];
        } else {
          throw new Error('Aucune vidéo trouvée avec cet ID');
        }
      } catch (error) {
        console.error(error);
        this.error = error.message; // Mettez l'erreur dans l'état
      }
    },
    formatDuration(duration) {
      // Convertit la durée ISO 8601 en format HH:MM:SS
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = (parseInt(match[1]) || 0);
      const minutes = (parseInt(match[2]) || 0);
      const seconds = (parseInt(match[3]) || 0);
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  mounted() {
    const videoId = this.$route.params.id;
    if (videoId) {
      this.fetchVideoDetails(videoId);
    } else {
      this.error = 'ID de vidéo manquant.';
    }
  },
};
</script>

<template>
    <div v-if="video">
      <h1>{{ video.snippet.title }}</h1>
      <img :src="video.snippet.thumbnails.medium.url" :alt="video.snippet.title" />
      <p><strong>Description :</strong> {{ video.snippet.description }}</p>
      <p><strong>Durée :</strong> {{ formatDuration(video.contentDetails.duration) }}</p>
      <iframe
        :src="`https://www.youtube.com/embed/${video.id}`"
        width="100%"
        height="500px"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div v-else>
      <p>Chargement des détails de la vidéo...</p>
    </div>
    <div v-if="error">
      <p style="color: red;">{{ error }}</p>
    </div>
</template>
  

  
  <style scoped>
  /* Ajoutez ici vos styles CSS si nécessaire */
  </style>
  