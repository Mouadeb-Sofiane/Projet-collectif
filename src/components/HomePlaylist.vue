// HomePlaylist.vue
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import PocketBase from 'pocketbase';
import VideoCarousel from './VideoCarrousel.vue';


export default defineComponent({
  name: 'HomePlaylist',
  components: {
    VideoCarousel
  },
  setup() {
    const sliderVideos = ref<Video[]>([]);

    const fetchVideos = async () => {
      try {
        const pb = new PocketBase('http://127.0.0.1:8090');
        const videos = await pb.collection('videos').getFullList({
          sort: '-created',
        });
        sliderVideos.value = videos.map((video: any) => ({
          id: video.id,
          title: video.title,
          videoId: video.videoId,
          duree: video.duree,
          description: video.description,
          duration: video.duration,
          defaultThumbnail: video.thumbnail_url,
          customThumbnail: video.custom_thumbnail || null,
        }));
      } catch (error) {
        console.error('Erreur lors de la récupération des vidéos :', error);
      }
    };

    onMounted(fetchVideos);

    return {
      sliderVideos
    };
  }
});
</script>

<template>
  <div class="carousel-container relative bg-thirdColor mt-14 text-white p-6 w-full px-12">
    <h2 class="text-2xl md:text-3xl font-bold my-6">Revivez nos précédentes émissions</h2>
    <div class="relative mb-8 mr-12">
      <div class="h-1.5 w-[75%] md:w-[50%] lg:w-[25%] bg-primaryColor"></div>
    </div>
    <VideoCarousel :videos="sliderVideos" />
  </div>
</template>