<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  PropType,
} from "vue";
import { RouterLink } from "vue-router";

export interface Reportages {
  id_reportages: string; // Use 'id_reportages' properly
  title: string;
  videoId: string;
  duree?: string;
  description: string;
  duration?: number;
  defaultThumbnail?: string;
  customThumbnail?: string | null;
}

export default defineComponent({
  name: "ReportagesPlaylists",
  props: {
    reportages: {
      type: Array as PropType<Reportages[]>,
      required: true,
    },
  },
  setup(props) {
    const currentIndex = ref(0);
    const itemWidth = ref(0);
    const visibleItems = ref(4);
    const carouselTrack = ref<HTMLElement | null>(null);

    // Fonction pour calculer le nombre d'éléments visibles en fonction de la taille de la fenêtre
    const calculateVisibleItems = () => {
      const width = window.innerWidth;
      if (width < 640) {
        visibleItems.value = 1;
      } else if (width < 1024) {
        visibleItems.value = 2;
      } else {
        visibleItems.value = 4;
      }
      if (carouselTrack.value) {
        itemWidth.value = carouselTrack.value.clientWidth / visibleItems.value;
      }
    };

    // Fonction pour formater la durée en minutes et secondes
    const formatDuration = (duration: number): string => {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m${seconds < 10 ? "0" : ""}${seconds}`;
    };

    // Fonctions pour faire défiler le carrousel
    const scrollNext = () => {
      if (currentIndex.value + visibleItems.value < props.reportages.length) {
        currentIndex.value += visibleItems.value;
      }
    };

    const scrollPrev = () => {
      if (currentIndex.value > 0) {
        currentIndex.value -= visibleItems.value;
      }
    };

    const goToSlide = (index: number) => {
      currentIndex.value = index * visibleItems.value;
    };

    onMounted(() => {
      calculateVisibleItems();
      window.addEventListener("resize", calculateVisibleItems);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", calculateVisibleItems);
    });

    return {
      currentIndex,
      itemWidth,
      visibleItems,
      carouselTrack,
      formatDuration,
      scrollNext,
      scrollPrev,
      goToSlide,
    };
  },
});
</script>

<template>
  <div class="relative overflow-hidden w-full">
    <div
      class="flex transition-transform duration-700 ease-in-out w-full"
      :style="{ transform: `translateX(-${currentIndex * itemWidth}px)` }"
      ref="carouselTrack"
    >
      <div
        v-for="reportage in reportages"
        :key="reportage.id_reportages"
        class="carousel-item flex-shrink-0 w-full px-2"
        :style="{ width: `${itemWidth}px` }"
      >
        <div class="rounded-lg shadow-md">
          <div class="relative w-full aspect-video flex-shrink-0">
            <RouterLink
              :to="{
                name: 'singleReportagePocket',
                params: { id: reportage.id_reportages },
              }"
            >
              <img
                :src="`https://img.youtube.com/vi/${reportage.videoId}/sddefault.jpg`"
                :alt="`Vignette de ${reportage.title}`"
                class="w-full h-full object-cover"
              />
            </RouterLink>
            <div>
              <span
                v-if="reportage.duration"
                class="bg-primaryColor absolute bottom-2 right-2 bg-black bg-opacity-75 text-black text-xs px-2 py-1 rounded"
              >
                {{ formatDuration(reportage.duration) }}
              </span>
              <span
                v-else
                class="bg-primaryColor absolute bottom-2 right-2 bg-black bg-opacity-75 text-black font-semibold text-xs px-2 py-1 rounded"
              >
                {{ reportage.duree }}
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="md:text-xl font-bold truncate">{{ reportage.title }}</h3>
            <h3 class="mt-1 font-light text-sm truncate line-clamp-2">
              {{ reportage.description }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="currentIndex > 0"
      @click="scrollPrev"
      class="absolute top-1/2 left-[-0.3rem] transform -translate-y-1/2 w-12 h-[18rem] flex items-center justify-center text-white hover:bg-opacity-80"
      style="
        background: linear-gradient(
          to right,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0) 100%
        );
      "
    >
      <svg
        width="16"
        height="28"
        viewBox="0 0 16 28"
        fill="none"
        class="transform rotate-180"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.4205 15.4797L2.88369 27.8639L0 24.7684L10.0949 13.932L0 3.09551L2.88369 0L14.4205 12.3842C14.8028 12.7947 15.0176 13.3515 15.0176 13.932C15.0176 14.5125 14.8028 15.0692 14.4205 15.4797Z"
          fill="white"
        />
      </svg>
    </button>

    <button
      v-if="currentIndex + visibleItems < reportages.length"
      @click="scrollNext"
      class="absolute top-1/2 right-[-0.3rem] transform -translate-y-1/2 w-12 h-[18rem] flex items-center justify-center text-white hover:bg-opacity-80"
      style="
        background: linear-gradient(
          to left,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0) 100%
        );
      "
    >
      <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M14.4205 15.4797L2.88369 27.8639L0 24.7684L10.0949 13.932L0 3.09551L2.88369 0L14.4205 12.3842C14.8028 12.7947 15.0176 13.3515 15.0176 13.932C15.0176 14.5125 14.8028 15.0692 14.4205 15.4797Z"
          fill="white"
        />
      </svg>
    </button>

    <!-- Pagination Indicators -->
    <div class="flex justify-center mt-4">
      <span
        v-for="(_, index) in Math.ceil(reportages.length / visibleItems)"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-3 h-3 mx-1 rounded-full cursor-pointer',
          currentIndex === index * visibleItems ? 'bg-white' : 'bg-gray-500',
        ]"
      />
    </div>
  </div>
</template>
