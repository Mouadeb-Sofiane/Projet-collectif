<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PocketBase from 'pocketbase';
import CustomVideoPlayer from '@/components/CustomVideoPlayer.vue';
import Share from '@/img/partager.png';

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

const route = useRoute();
const video = ref<Video | null>(null);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string>('');
const isExpanded = ref<boolean>(false);
const isCopied = ref<boolean>(false);

const toggleDescription = (): void => {
  isExpanded.value = !isExpanded.value;
};

const copyLink = async (): Promise<void> => {
  try {
    const link = window.location.href; // Récupère le lien actuel
    await navigator.clipboard.writeText(link);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false; // Réinitialise l'état après 2 secondes
    }, 2000);
  } catch (error) {
    console.error('Erreur lors de la copie du lien :', error);
  }
};

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

            <div class="flex justify-start mt-8 relative">
              <img
                :src="Share"
                class="w-8 h-8 cursor-pointer"
                alt="Share"
                @click="copyLink"
              />
              <div
                v-if="isCopied"
                class="absolute top-10 left-0 flex items-center space-x-2 text-sm text-green-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z" />
                </svg>
                <span>Copié dans le presse-papiers !</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-none {
  -webkit-line-clamp: unset;
}
</style>
