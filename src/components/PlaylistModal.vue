<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  isOpen: boolean;
  playlist: {
    id: string;
    title: string;
    thumbnailurl: string | null;
    description?: string;
    date?: string;
  };
  videos: Array<{
    id: string;
    title: string;
    VideoTele: string | null;
    videoId?: string;
    description?: string;
    duree?: string;
    date?: string;
  }>;
  onClose: () => void;
}

const props = defineProps<Props>();
const activeTab = ref<'episodes' | 'info'>('episodes');
const showModal = ref(false);

// Animation du modal
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      showModal.value = true;
    }, 50);
  } else {
    showModal.value = false;
  }
});

</script>

<template>
    <Transition
      enter-active-class="transition ease-out duration-1000"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-200 scale-100"
      leave-active-class="transition ease-in duration-400"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 bg-black/80 overflow-y-auto md:pt-8 modal-content"
        @click.self="onClose"
      >
      <div 
        class="min-h-screen md:min-h-0 w-full lg:w-[70%] md:w-[90%] md:max-w-7xl mx-auto bg-[#141414] text-white md:rounded-lg relative transform transition-all"
        :class="{ 'opacity-100 translate-y-0': showModal, 'opacity-0 translate-y-4': !showModal }"
      >
        <!-- Header avec bannière -->
        <div class="w-full h-[400px] md:h-[500px] relative">
          <img
            :src="playlist.thumbnailurl || 'default-banner.jpg'"
            :alt="playlist.title"
            class="w-full h-full object-cover md:rounded-t-lg"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent md:rounded-t-lg"></div>
          
          <div class="absolute bottom-8 left-8 right-8">
            <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ playlist.title }}</h1>
            <p class="text-lg md:text-xl text-gray-300 max-w-2xl">
              WEB TV DE L'IUT DE NORD FRANCHE-COMTÉ : UN REGARD DYNAMIQUE SUR NOTRE CAMPUS
            </p>
          </div>

          <button
            class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10 p-2"
            @click="onClose"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="border-b border-white/10">
          <div class="flex space-x-8 px-8 py-4">
            <button 
              @click="activeTab = 'episodes'"
              :class="['font-medium transition-colors', activeTab === 'episodes' ? 'text-white' : 'text-white/50']"
            >
              EPISODES
            </button>

            <button 
              @click="activeTab = 'info'"
              :class="['font-medium transition-colors', activeTab === 'info' ? 'text-white' : 'text-white/50']"
            >
              PLUS D'INFOS
            </button>
          </div>
        </nav>

        <!-- Contenu dynamique -->
        <div class="px-8 py-6">
          <!-- Episodes -->
          <div v-if="activeTab === 'episodes'" class="space-y-6">
            <div
              v-for="(video, index) in videos"
              :key="video.id"
              class="flex flex-col md:flex-row gap-6 group hover:bg-white/5 p-4 rounded-lg transition-colors"
            >
              <div class="relative w-full md:w-[300px] aspect-video flex-shrink-0">
                <video
                  :src="`http://127.0.0.1:8090/api/files/videos/${video.id}/${video.VideoTele}`"
                  class="w-full h-full object-cover rounded-lg"
                  controls
                ></video>
              </div>

              <div class="flex-grow space-y-2">
                <div class="flex items-center gap-3">
                  <h3 class="font-medium text-2xl">Episode {{ index + 1 }}</h3>
                  <span class="text-sm text-gray-400">{{ video.duree || '49 min' }}</span>
                </div>
                <h4 class="text-lg font-medium group-hover:text-primaryColor transition-colors">
                  {{ video.title }}
                </h4>
                <p class="text-gray-400 text-sm">{{ video.description }}</p>
              </div>
            </div>
          </div>

          <!-- Plus d'infos -->
          <div v-if="activeTab === 'info'" class="max-w-3xl mx-auto space-y-8">
            <div class="space-y-4">
              <h2 class="text-2xl font-bold">À propos de l'émission</h2>
              <p class="text-gray-300 leading-relaxed">
                {{ playlist.description || "Description de l'émission non disponible" }}
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-8">
              <div>
                <h3 class="text-lg font-semibold mb-2">Détails techniques</h3>
                <ul class="space-y-2 text-gray-300">
                  <li v-if="playlist.date">
                    <span class="text-gray-500">Date de diffusion:</span> 
                    {{ new Date(playlist.date).toLocaleDateString('fr-FR') }}
                  </li>
                  <li><span class="text-gray-500">Qualité:</span> HD</li>
                  <li><span class="text-gray-500">Format:</span> 16:9</li>
                </ul>
              </div>
              
              <div>
                <h3 class="text-lg font-semibold mb-2">Production</h3>
                <ul class="space-y-2 text-gray-300">
                  <li><span class="text-gray-500">Réalisation:</span> IUT Nord Franche-Comté</li>
                  <li><span class="text-gray-500">Production:</span> Service Communication</li>
                  <li><span class="text-gray-500">Distribution:</span> Web TV IUT</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>