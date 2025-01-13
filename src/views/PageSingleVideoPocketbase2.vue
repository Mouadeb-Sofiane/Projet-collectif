
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PocketBase from 'pocketbase';
import CustomVideoPlayer from '@/components/CustomVideoPlayer.vue';

interface Video {
  id: string;
  title: string;
  description: string;
  casting: string;
  realisation: string;
  date: string;
  duree: string;
  VideoTele: string;
}

// Gestion des données de la vidéo
const route = useRoute();
const video = ref<Video | null>(null);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>('');

// Gestion de l'état dynamique pour la description
const isExpanded = ref<boolean>(false);

const toggleDescription = (): void => {
  isExpanded.value = !isExpanded.value; // Bascule entre affiché et masqué
};

// Chargement des données à l'initialisation
onMounted(async () => {
  isLoading.value = true;
  try {
    const pb = new PocketBase('http://127.0.0.1:8090');
    const videoId = route.params.id as string;

    if (!videoId) {
      throw new Error('ID de vidéo manquant');
    }

    video.value = await pb.collection('videos').getOne<Video>(videoId);
  } catch (error) {
    console.error('Erreur lors du chargement de la vidéo :', error);
    errorMessage.value = 'Impossible de charger la vidéo.';
  } finally {
    isLoading.value = false;
  }
});
</script>


<template>
  <div class="p-6 pt-24 bg-black text-white">
    <div v-if="isLoading" class="flex justify-center items-center h-screen">
      <p class="text-lg">Chargement de la vidéo...</p>
    </div>

    <div v-if="errorMessage" class="text-center text-red-500 py-6">
      <p>{{ errorMessage }}</p>
    </div>

    <template v-if="video && !isLoading">
     

      <div class="max-w-[100rem] lg:flex lg:items-start lg:space-x-8 mx-12">
        <div class="relative flex justify-center mb-8 lg:w-5/10">
          <CustomVideoPlayer
            v-if="video.VideoTele"
            :video-url="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`"
            class="w-full rounded-md shadow-lg"
          />
        </div>

        <div class="md:w-2/3 space-y-8">
          <div class="space-y-4">
            <h1 class="pb-6 mx-auto uppercase text-xl md:text-2xl font-bold mb-4">
        {{ video.title }}
      </h1>
      <div class="relative flex flex-row-reverse items-start overflow-hidden">
  <!-- Bouton pour afficher/masquer la description -->
  <button
    id="descriptionArrow"
    aria-controls="descriptionPanel"
    class="text-white"
    @click="toggleDescription"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="currentColor"
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
      class="size-6 transition-transform duration-100"
      :class="{'rotate-180': isExpanded}"
    >
      <path
        fill-rule="evenodd"
        d="M17.248 22.667h-2.496l-9.062-9.76 1.954-1.814L15.914 20h.171l8.271-8.907 1.954 1.814z"
        clip-rule="evenodd"
      ></path>
    </svg>
  </button>

  <!-- Section de la description -->
  <p
    id="descriptionPanel"
    aria-labelledby="descriptionArrow"
    :aria-expanded="isExpanded.toString()"
    class="mr-2 line-clamp-2 pr-2.5 text-secondary overflow-visible"
    :class="{'line-clamp-none': isExpanded}"
  >
    {{ video.description }}
  </p>
</div>

            <div>
              <h3 class="text-xl font-semibold">Casting</h3>
              <p class="text-gray-300">{{ video.casting }}</p>
            </div>

            <div>
              <h3 class="text-xl font-semibold">Réalisé par</h3>
              <p class="text-gray-300">{{ video.realisation }}</p>
            </div>

            <div class="flex justify-between text-sm text-gray-400">
              <p>
                Date de publication :
                {{ video.date ? new Date(video.date).toLocaleDateString('fr-FR') : 'Non disponible' }}
              </p>
              <p>Durée : {{ video.duree || 'Non disponible' }}</p>
            </div>
          </div>

          <div class="flex justify-start mt-8">
            <button
              class="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md"
            >
              Partager
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>