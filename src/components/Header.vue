<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import SearchIcon from "./icons/SearchIcon.vue";

const isOpen = ref(false);

const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMobileMenu = () => {
  isOpen.value = false;
};
</script>

<template>
  <header class="w-full fixed top-0 z-50">
    <nav style="background: linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%);">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <RouterLink to="/" class="py-4">
            <div class="flex-shrink-0">
              <img src="../img/WEBTV.png" class="h-12" alt="logo du site"/>
            </div>
          </RouterLink>
          
          <!-- Bouton du menu mobile -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden text-white hover:text-gray-300 focus:outline-none focus:text-gray-300"
          >
            <svg v-if="!isOpen" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M3 9h14a1 1 0 110 2H3a1 1 0 110-2zm0-4h14a1 1 0 110 2H3a1 1 0 110-2zm0 8h14a1 1 0 110 2H3a1 1 0 110-2z" clip-rule="evenodd"></path>
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M6 6a.75.75 0 011.06 0L10 8.94l2.47-2.47a.75.75 0 111.06 1.06L11.06 10l2.47 2.47a.75.75 0 11-1.06 1.06L10 11.06l-2.47 2.47a.75.75 0 01-1.06-1.06L8.94 10 6.47 7.53A.75.75 0 016 6z" clip-rule="evenodd"></path>
            </svg>
          </button>

          <!-- Menu pour les grands écrans -->
          <div class="hidden md:block">
            <ul class="flex space-x-4">
              <li>
                <RouterLink @click="closeMobileMenu" to="/" class="block py-2 pr-4 pl-3 text-gray-300 border-b border-transparent hover:text-gray-50">Accueil</RouterLink>
              </li>
              <li>
                <RouterLink @click="closeMobileMenu" to="/carouselAPI" class="block py-2 pr-4 pl-3 text-gray-300 border-b border-transparent hover:text-gray-50">Playlists</RouterLink>
              </li>
              <li>
                <RouterLink @click="closeMobileMenu" to="/carouseltest" class="block py-2 pr-4 pl-3 text-gray-300 border-b border-transparent hover:text-gray-50">Carousel Test</RouterLink>
              </li>
              <li>
                <RouterLink @click="closeMobileMenu" to="/pocketbasetest" class="block py-2 pr-4 pl-3 text-gray-300 border-b border-transparent hover:text-gray-50">Pocketbase Test</RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- Menu pour les appareils mobiles -->
        <div 
          id="mobile-menu" 
          :class="{ 'hidden': !isOpen }" 
          class="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3"
        >
          <ul class="flex flex-col space-y-4">
            <li>
              <RouterLink @click="closeMobileMenu" to="/" class="block py-3 pr-4 pl-3 text-gray-200 rounded bg-primary-700">Accueil</RouterLink>
            </li>
            <li>
              <RouterLink @click="closeMobileMenu" to="/carouselAPI" class="block py-3 pr-4 pl-3 text-gray-200 rounded bg-primary-700">Playlists</RouterLink>
            </li>
            <li>
              <RouterLink @click="closeMobileMenu" to="/carouseltest" class="block py-3 pr-4 pl-3 text-gray-200 rounded bg-primary-700">Carousel Test</RouterLink>
            </li>
            <li>
              <RouterLink @click="closeMobileMenu" to="/pocketbasetest" class="block py-3 pr-4 pl-3 text-gray-200 rounded bg-primary-700">Pocketbase Test</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>