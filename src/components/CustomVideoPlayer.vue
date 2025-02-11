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
const isMouseOverControls = ref(false);
const hideTimeout = ref<number | null>(null);
const lastMouseMove = ref<number>(Date.now());
const availableSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (time: number): string => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  return `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const startHideTimer = () => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }

  hideTimeout.value = window.setTimeout(() => {
    const currentTime = Date.now();
    if (currentTime - lastMouseMove.value >= 3000 && isPlaying.value && !isMouseOverControls.value) {
      showControls.value = false;
    }
  }, 3000);
};

const handleMouseMove = () => {
  lastMouseMove.value = Date.now();
  showControls.value = true;
  startHideTimer();
};

const handleMouseEnter = () => {
  isMouseOverControls.value = true;
  showControls.value = true;
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
  }
};

const handleMouseLeave = () => {
  isMouseOverControls.value = false;
  if (isPlaying.value) {
    startHideTimer();
  }
};

const handlePlayPause = () => {
  if (!videoRef.value) return;
  if (isPlaying.value) {
    videoRef.value.pause();
    showControls.value = true;
    if (hideTimeout.value) {
      clearTimeout(hideTimeout.value);
    }
  } else {
    videoRef.value.play();
    startHideTimer();
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

const setPlaybackSpeed = (speed: number) => {
  if (!videoRef.value) return;
  videoRef.value.playbackRate = speed;
  playbackSpeed.value = speed;
  showSpeedOptions.value = false;
};

const toggleFullscreen = async () => {
  if (!containerRef.value) return;

  if (!document.fullscreenElement) {
    try {
      await containerRef.value.requestFullscreen();
      isFullscreen.value = true;
      startHideTimer();
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err);
    }
  } else {
    try {
      await document.exitFullscreen();
      isFullscreen.value = false;
      showControls.value = true;
      if (hideTimeout.value) {
        clearTimeout(hideTimeout.value);
      }
    } catch (err) {
      console.error('Error attempting to exit fullscreen:', err);
    }
  }
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

  startHideTimer();
});

onBeforeUnmount(() => {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="relative bg-black w-full h-full overflow-hidden cursor-auto"
    :class="{ 'fixed inset-0 z-50': isFullscreen }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <video
      ref="videoRef"
      :src="videoUrl"
      class="w-full h-full object-contain"
      @timeupdate="handleTimeUpdate"
      @click="handlePlayPause"
    />

    <div
      class="absolute bottom-0 left-0 right-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent transition-opacity"
      :class="{
        'opacity-0 pointer-events-none': !showControls,
        'opacity-100 pointer-events-auto': showControls,
      }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="absolute bottom-0 left-0 right-0 px-4 py-3">
        <div class="text-white text-sm mb-2">
          {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </div>
        <div
          ref="progressBarRef"
          class="w-full h-1 bg-white/30 cursor-pointer mb-4 relative"
          @click="handleProgressBarClick"
        >
          <div
            class="absolute top-0 left-0 h-full bg-orange-500"
            :style="{ width: `${(currentTime / duration) * 100}%` }"
          >
            <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
          </div>
        </div>

        <div class="flex items-center justify-between text-white">
          <div class="flex items-center space-x-2">
            <button @click="() => handleSkip(-10)" class="hover:text-[#FFA559] p-2">
              <img :src="BackIcon" class="w-8 h-8" alt="Retour rapide" />
            </button>

            <button @click="handlePlayPause" class="hover:text-[#FFA559] p-2">
              <div class="w-10 h-10 flex items-center justify-center">
                <svg v-if="!isPlaying" class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <svg v-else class="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              </div>
            </button>

            <button @click="() => handleSkip(10)" class="hover:text-[#FFA559] p-2">
              <img :src="ForwardIcon" class="w-8 h-8" alt="Avance rapide" />
            </button>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative">
              <button 
                @click="showSpeedOptions = !showSpeedOptions" 
                class="hover:text-[#FFA559] p-1 flex items-center"
              >
                <span class="text-sm">{{ playbackSpeed }}x</span>
              </button>
              
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

            <button @click="toggleMute" class="hover:text-[#FFA559] p-1">
              <svg v-if="!isMuted" class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            </button>

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

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}
</style>