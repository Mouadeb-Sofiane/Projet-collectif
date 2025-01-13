<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import BackIcon from '@/img/dos.png';
import ForwardIcon from '@/img/suivant.png';

interface Props {
  videoUrl: string;
}

const props = defineProps<Props>();
const containerRef = ref<HTMLDivElement | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const progressBarRef = ref<HTMLDivElement | null>(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const isMuted = ref(false);
const playbackSpeed = ref(1);
const showSpeedOptions = ref(false);
const isFullscreen = ref(false);
const showControls = ref(true);
const hideTimeout = ref<number | null>(null);
const availableSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

// Fonction pour masquer les contrôles
const hideControls = () => {
  if (hideTimeout.value) {
    window.clearTimeout(hideTimeout.value);
  }
  hideTimeout.value = window.setTimeout(() => {
    if (isFullscreen.value && !showSpeedOptions.value) {
      showControls.value = false;
    }
  }, 3000); // 3 secondes d'inactivité
};

// Fonction pour afficher les contrôles
const showControlsHandler = () => {
  showControls.value = true;
  hideControls();
};

// Reste du code existant...
const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const handlePlayPause = () => {
  if (!videoRef.value) return;
  
  if (isPlaying.value) {
    videoRef.value.pause();
  } else {
    videoRef.value.play();
  }
  isPlaying.value = !isPlaying.value;
};

const handleTimeUpdate = () => {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;
};

const handleProgressBarClick = (e: MouseEvent) => {
  if (!videoRef.value || !progressBarRef.value) return;
  
  const rect = progressBarRef.value.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  videoRef.value.currentTime = pos * duration.value;
};

const handleSkip = (seconds: number) => {
  if (!videoRef.value) return;
  videoRef.value.currentTime = videoRef.value.currentTime + seconds;
};

const toggleMute = () => {
  if (!videoRef.value) return;
  videoRef.value.muted = !videoRef.value.muted;
  isMuted.value = !isMuted.value;
};

const toggleFullscreen = async () => {
  if (!containerRef.value) return;
  
  if (!document.fullscreenElement) {
    try {
      await containerRef.value.requestFullscreen();
      isFullscreen.value = true;
      hideControls(); // Démarrer le timer quand on passe en plein écran
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err);
    }
  } else {
    try {
      await document.exitFullscreen();
      isFullscreen.value = false;
      showControls.value = true; // Toujours afficher les contrôles hors plein écran
      if (hideTimeout.value) {
        window.clearTimeout(hideTimeout.value);
      }
    } catch (err) {
      console.error('Error attempting to exit fullscreen:', err);
    }
  }
};

const setPlaybackSpeed = (speed: number) => {
  if (!videoRef.value) return;
  videoRef.value.playbackRate = speed;
  playbackSpeed.value = speed;
  showSpeedOptions.value = false;
  hideControls(); // Redémarrer le timer après avoir changé la vitesse
};

onMounted(() => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration;
    videoRef.value.addEventListener('loadedmetadata', () => {
      duration.value = videoRef.value?.duration || 0;
    });
  }

  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
});

// Nettoyer le timeout quand le composant est détruit
onBeforeUnmount(() => {
  if (hideTimeout.value) {
    window.clearTimeout(hideTimeout.value);
  }
});
</script>

<template>
  <div 
    ref="containerRef"
    class="relative bg-black w-full h-full group"
    :class="{ 'fixed inset-0 z-50': isFullscreen }"
    @mousemove="showControlsHandler"
  >
    <!-- Video -->
    <video
      ref="videoRef"
      :src="videoUrl"
      class="w-full h-full object-contain"
      @timeupdate="handleTimeUpdate"
      @click="handlePlayPause"
    />

    <!-- Controls overlay with gradient -->
    <div 
      class="absolute bottom-0 left-0 right-0 w-full h-full bg-gradient-to-t from-orange-500/30 to-transparent transition-opacity duration-300"
      :class="{
        'opacity-0': !showControls,
        'opacity-100': showControls && (isFullscreen || isPlaying),
        'group-hover:opacity-100': !isFullscreen
      }"
    >
      <div class="absolute bottom-0 left-0 right-0 px-4 py-3">
        <!-- Le reste du code des contrôles reste identique -->
        <!-- Time display -->
        <div class="text-white text-sm mb-2">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>

        <!-- Progress bar -->
        <div 
          ref="progressBarRef"
          class="w-full h-1 bg-white/30 cursor-pointer mb-4 relative"
          @click="handleProgressBarClick"
        >
          <div 
            class="absolute top-0 left-0 h-full bg-[#FFA559]"
            :style="{ width: `${(currentTime / duration) * 100}%` }"
          >
            <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#FFA559] rounded-full"></div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-between text-white">
          <div class="flex items-center">
            <!-- Skip backward -->
            <button @click="() => handleSkip(-10)" class="hover:text-[#FFA559] p-2">
              <img :src="BackIcon" class="w-8 h-8" alt="Rewind" />
            </button>

            <!-- Play/Pause -->
            <button @click="handlePlayPause" class="hover:text-[#FFA559] p-2">
              <div class="w-10 h-10 flex items-center justify-center">
                <svg
                  v-if="!isPlaying"
                  class="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg
                  v-else
                  class="w-10 h-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              </div>
            </button>

            <!-- Skip forward -->
            <button @click="() => handleSkip(10)" class="hover:text-[#FFA559] p-2">
              <img :src="ForwardIcon" class="w-8 h-8" alt="Forward" />
            </button>
          </div>

          <div class="flex items-center gap-4">
            <!-- Playback Speed -->
            <div class="relative">
              <button 
                @click="showSpeedOptions = !showSpeedOptions" 
                class="hover:text-[#FFA559] p-1 flex items-center"
              >
                <span class="text-sm">{{ playbackSpeed }}x</span>
              </button>
              
              <!-- Speed options dropdown -->
              <div 
                v-if="showSpeedOptions"
                class="absolute bottom-full mb-2 bg-black/90 rounded-lg py-2"
              >
                <button
                  v-for="speed in availableSpeeds"
                  :key="speed"
                  @click="setPlaybackSpeed(speed)"
                  class="block w-full px-4 py-1 text-sm text-left hover:bg-[#FFA559]/20"
                  :class="{ 'text-[#FFA559]': playbackSpeed === speed }"
                >
                  {{ speed }}x
                </button>
              </div>
            </div>

            <!-- Volume -->
            <button @click="toggleMute" class="hover:text-[#FFA559] p-1">
              <svg v-if="!isMuted" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            </button>

            <!-- Fullscreen -->
            <button @click="toggleFullscreen" class="hover:text-[#FFA559] p-1">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}

video::-webkit-media-controls-enclosure {
  display: none !important;
}
</style>