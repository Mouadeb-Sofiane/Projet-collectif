<template>
    <div class="bg-black text-white relative h-screen w-full">
      <!-- Image de fond -->
      <div class="absolute inset-0">
        <img
          src="@/img/desert-sahara-algeria-dune-wallpaper-preview.jpg"
          alt="Background"
          class="w-full h-full object-cover"
        />
      </div>
  
      <!-- Dégradés -->
      <div 
        class="absolute inset-x-0 bottom-0"
        style="background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); height: 50%;"
      ></div>
      <div 
        class="hidden md:block absolute inset-y-0 left-0"
        style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); width: 50%;"
      ></div>
  
      <!-- Contenu textuel -->
      <div
        class="absolute inset-0 flex flex-col justify-end items-center text-center md:text-start p-6 text-white md:justify-center md:items-start md:p-12"
      >
        <h1 class="text-sm font-[400] mb-[1rem] md:text-sm md:mb-12 tracking-[0.5em]">
          REPORTAGE
        </h1>
        <h1 class="text-5xl font-[800] mb-[3rem] md:text-5xl lg:text-7xl md:mb-8 max-w-2xl uppercase">
          TITRE DU REPORTAGE
        </h1>
        <p class="text-lg mb-[3rem] md:text-2xl md:mb-8 max-w-lg uppercase">
          Ceci est une description fixe du reportage ou de la vidéo.
        </p>
  
        <!-- Boutons d'action -->
        <div class="mb-10 flex flex-col md:flex-row md:space-x-4">
          <a
            href="#"
            target="_blank"
            class="bg-white hover:bg-gray-300 text-black font-semibold py-2 px-6 rounded-lg shadow-lg transition-all"
          >
            VOIR LE DIRECT
          </a>
          <a
            href="#"
            class="bg-gray-700 hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-all mt-4 md:mt-0"
          >
            PLUS D'INFO
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  img::-webkit-media-controls {
    display: none !important;
  }
  
  /* Ajoute des styles supplémentaires pour l'amélioration responsive si nécessaire */
  </style>
  