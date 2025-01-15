<script setup lang="ts">
  import { RouterLink } from "vue-router";
  import FacebookIcon from "./icons/FacebookIcon.vue";
  import InstagramIcon from "./icons/InstagramIcon.vue";
  import YoutubeIcon from "./icons/YoutubeIcon.vue";
  import LinkedinIcon from "./icons/LinkedinIcon.vue";
  import WEBTVLogo from "./icons/WEBTV-Logo.vue";
</script>

<template>
  <div class="h-0.5 bg-orange-500 w-full"></div>
  <footer class="bg-black text-white py-8">
    <div class="container mx-auto px-6 md:px-12">
      <!-- Grille principale -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <!-- Section Programmes -->
        <div>
          <h2 class="text-2xl font-bold mb-4">Programmes</h2>
          <div class="h-0.5 bg-orange-500 w-full mb-10"></div>
          <ul class="grid grid-cols-2 gap-2 text-gray-300">
            <li><RouterLink to="/rediffusions" class="hover:text-white">Rediffusions</RouterLink></li>
            <li><RouterLink to="/reportages" class="hover:text-white">Reportages</RouterLink></li>
            <li><RouterLink to="/en-direct" class="hover:text-white">En direct</RouterLink></li>
            <li><RouterLink to="/documentaire" class="hover:text-white">Documentaire</RouterLink></li>
            <li><RouterLink to="/emission-21" class="hover:text-white">Émission 21</RouterLink></li>
          </ul>
        </div>

        <!-- Section Services et Apps -->
        <div>
          <h2 class="text-2xl font-bold mb-4">Services et apps</h2>
          <div class="h-0.5 bg-orange-500 w-full mb-10"></div>
          <ul class="grid grid-cols-2 gap-2 text-gray-300">
            <li><RouterLink to="/mentions-legales" class="hover:text-white">Mentions légales</RouterLink></li>
            <li><RouterLink to="/faq" class="hover:text-white">FAQ</RouterLink></li>
            <li><RouterLink to="/politique-cookies" class="hover:text-white">Politique cookies</RouterLink></li>
            <li><RouterLink to="/en-savoir-plus" class="hover:text-white">En savoir plus</RouterLink></li>
            <li><RouterLink to="/politique-confidentialite" class="hover:text-white">Politique de confidentialité</RouterLink></li>
            <li><RouterLink to="/apropos" class="hover:text-white">À propos</RouterLink></li>
            <li>
              <RouterLink to="/conditions-utilisation" class="hover:text-white">
                Conditions générales d'utilisation
              </RouterLink>
            </li>
       
          </ul>
        </div>


        <!-- Section Réseaux sociaux -->
        <div class="flex flex-col items-start md:items-end">
          <!-- Logo -->
          <RouterLink to="/" class="mb-6">
            <WEBTVLogo class="h-20"/>
          </RouterLink>
        </div>
        
        <div class="flex flex-col items-start">
          <!-- Icônes réseaux sociaux -->
          <div class="flex space-x-4 text-gray-300">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <FacebookIcon class="h-20" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <InstagramIcon  class="h-20" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <LinkedinIcon  class="h-20" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
            >
              <YoutubeIcon  class="h-20" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
