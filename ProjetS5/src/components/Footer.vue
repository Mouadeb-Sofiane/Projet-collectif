<script setup lang="ts">
    import { ref, defineProps, onMounted } from 'vue';
    import { RouterLink } from 'vue-router';
</script>

<template>
    <footer class="bg-gray-900 text-gray-300">
      <div class="container mx-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Colonne 1 -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-gray-100">À propos</h3>
            <p class="text-gray-100">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ut bibendum urna.</p>
          </div>
  
          <!-- Colonne 2 -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-gray-100">Liens rapides</h3>
            <ul>
              <li>                  
                <RouterLink to="/" class="text-xl text-gray-100">Accueil</RouterLink>
              </li>
              <li><a href="#" class="text-gray-100">Services</a></li>
              <li><a href="#" class="text-gray-100">Contact</a></li>
            </ul>
          </div>
  
          <!-- Colonne 3 -->
          <div>
            <h3 class="text-lg font-bold mb-4 text-gray-100">Contact</h3>
            <p class="text-gray-100">Email: <a href="https://mail.google.com/mail/u/1/#inbox?compose=GTvVlcSHwrvPxPSCbQHKdKsWdRxwPqhdRJXLzQNMVlCcjbHTCXDbtDgjNtlGZdxxJGbhWCqlbqlzq" class="hover:text-gray-400">sofiane.mouadeb.70000@gmail.com</a></p>
            <p class="text-gray-100">Téléphone: <a href="tel:0783889373" class="hover:text-gray-400">+33 7 83 88 93 73</a></p>
          </div>
  
          <!-- Colonne 4 -->
          <div>
            <h3 class="text-lg font-bold mb-4">Suivez-moi</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-white hover:text-gray-400">sd</a>
              <a href="#" class="text-white hover:text-gray-400">sdds</a>
              <a href="#" class="text-white hover:text-gray-400">sdds</a>
            </div>
          </div>
        </div>
      </div>
  
      <div class="bg-gray-800 p-4 text-center">
        <p class="text-gray-400">&copy; 2024 Sofiane Mouadeb. Portfolio personnel.</p>
      </div>
    </footer>
  </template>
  