<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import WEBTVLogo from "./icons/WEBTV-Logo.vue";

// État d'ouverture du menu mobile
const isOpen = ref(false);

// Fonction pour ouvrir/fermer le menu mobile
const toggleMobileMenu = () => {
  isOpen.value = !isOpen.value;
  document.body.classList.toggle("no-scroll", isOpen.value); // Ajout ou retrait de la classe no-scroll
};

// Fonction pour fermer le menu mobile
const closeMobileMenu = () => {
  isOpen.value = false;
  document.body.classList.remove("no-scroll"); // Suppression de la classe no-scroll
};
</script>

<template>
  <header class="w-full fixed top-0 z-50">
    <nav
      class="relative"
      style="background: linear-gradient(rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)"
    >
      <div class="container h-full px-4 md:px-8 p-5">
        <div class="flex items-center">
          <!-- Logo -->
          <RouterLink to="/" class="flex-shrink-0">
            <WEBTVLogo class="h-12" alt="logo du site" />
          </RouterLink>

          <!-- Liens pour grands écrans -->
          <div class="hidden px-20 md:flex space-x-9">
            <RouterLink to="/emissions" class="text-gray-300 hover:text-white text-xl">
              Emissions
            </RouterLink>
            <RouterLink to="/reportages" class="text-gray-300 hover:text-white text-xl">
              Reportages
            </RouterLink>
            <RouterLink to="/rediffusions" class="text-gray-300 hover:text-white text-xl">
              Rediffusions
            </RouterLink>
            <RouterLink to="/youtubelive" class="text-gray-300 hover:text-white text-xl">
              Live
            </RouterLink>
            <RouterLink to="/apropos" class="text-gray-300 hover:text-white text-xl">
              À propos
            </RouterLink>

          </div>

          <!-- Bouton menu mobile -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden text-white hover:text-gray-300 focus:outline-none absolute top-4 right-4 bg-inherit"
          >
            <!-- Icône menu -->
            <svg v-if="!isOpen" viewBox="0 0 20 20" fill="currentColor" class="w-6 h-6">
              <path
                fill-rule="evenodd"
                d="M3 9h14a1 1 0 110 2H3a1 1 0 110-2zm0-4h14a1 1 0 110 2H3a1 1 0 110-2zm0 8h14a1 1 0 110 2H3a1 1 0 110-2z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <!-- Icône croix -->
            <svg v-else viewBox="0 0 20 20" fill="white" class="w-6 h-6">
              <path
                fill-rule="evenodd"
                d="M6 6a.75.75 0 011.06 0L10 8.94l2.47-2.47a.75.75 0 111.06 1.06L11.06 10l2.47 2.47a.75.75 0 11-1.06 1.06L10 11.06l-2.47 2.47a.75.75 0 01-1.06-1.06L8.94 10 6.47 7.53A.75.75 0 016 6z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Menu mobile -->
        <div
          id="mobile-menu"
          :class="{ hidden: !isOpen }"
          class="absolute top-0 left-0 w-full min-h-screen bg-gradient-to-b from-black via-black to-gray-900 text-white px-4 py-6 transition-opacity duration-400 md:hidden"
        >
          <div class="flex justify-between items-center mb-8">
            <!-- Logo -->
            <RouterLink to="/" class="flex-shrink-0">
              <WEBTVLogo class="h-12" alt="logo du site" />
            </RouterLink>
            <!-- Bouton fermeture -->
            <button @click="closeMobileMenu" class="text-white bg-inherit">
              <svg viewBox="0 0 20 20" fill="white" class="w-8 h-8">
                <path
                  fill-rule="evenodd"
                  d="M6 6a.75.75 0 011.06 0L10 8.94l2.47-2.47a.75.75 0 111.06 1.06L11.06 10l2.47 2.47a.75.75 0 11-1.06 1.06L10 11.06l-2.47 2.47a.75.75 0 01-1.06-1.06L8.94 10 6.47 7.53A.75.75 0 016 6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <!-- Liens menu mobile -->
          <ul class="flex flex-col space-y-4 text-center">
            <li>
              <RouterLink
                @click="closeMobileMenu"
                to="/emissions"
                class="block py-3 text-gray-200 bg-primary-700 rounded"
              >
                Emissions
              </RouterLink>
            </li>
            <li>
              <RouterLink
                @click="closeMobileMenu"
                to="/reportages"
                class="block py-3 text-gray-200 bg-primary-700 rounded"
              >
                Reportages
              </RouterLink>
            </li>
            <li>
              <RouterLink
                @click="closeMobileMenu"
                to="/rediffusions"
                class="block py-3 text-gray-200 bg-primary-700 rounded"
              >
                Rediffusions
              </RouterLink>
            </li>
            <li>
              <RouterLink
                @click="closeMobileMenu"
                to="/youtubelive"
                class="block py-3 text-gray-200 bg-primary-700 rounded"
              >
                Live
              </RouterLink>
            </li>
            <li>
              <RouterLink
                @click="closeMobileMenu"
                to="/apropos"
                class="block py-3 text-gray-200 bg-primary-700 rounded"
              >
                À propos
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style>
.no-scroll {
  overflow: hidden;
  height: 100vh;
}
</style>
