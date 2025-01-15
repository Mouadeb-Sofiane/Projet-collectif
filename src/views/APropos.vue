<script setup lang="ts">
</script>

<template>
  <div>
    <div class="relative w-max-full h-[50vh] overflow-hidden">
    <img
      src="../img/APropos/img0.png"
      class="w-full h-full object-cover"
      >
     <!-- Dégradés -->
    <div 
        class="absolute inset-x-0 bottom-0"
        style="background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); height: 50%;"
      ></div>

       <!-- Dégradé sur la gauche (uniquement pour desktop >= 768px) -->
      <div 
        class="hidden md:block absolute inset-y-0 left-0"
        style="background: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%); width: 50%;"
      ></div>   
    </div>
  </div>


  <div class="bg-black text-white min-h-screen ">
    <!-- Section À PROPOS -->
    <div class="container mx-auto p-6 ">
      <div class="flex flex-col lg:flex-row items-center  lg:items-start">
        <!-- Texte à gauche -->
        <div class="lg:w-1/2 text-center lg:text-left mb-6 lg:mb-0">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 ">À PROPOS</h2>
          <div class="flex justify-center">
            <div class="h-3.5 w-full bg-orange-400 mb-8"></div>
          </div>
          <p class="text-gray-300 text-justify">
            Bienvenue sur la WebTV de l'IUT Nord Franche-Comté, 
            un espace dédié à la vie étudiante et aux projets qui 
            animent notre campus. Que vous soyez étudiant, futur 
            étudiant, parent, ou simplement curieux de découvrir 
            notre univers, notre WebTV offre un accès privilégié 
            à des contenus variés et engageants : témoignages 
            d’étudiants, reportages, événements, et bien plus 
            encore. Nous avons conçu cette plateforme pour connecter 
            la communauté de l’IUT, valoriser ses talents, et faire 
            rayonner la diversité de nos parcours. IPSUM LOREM IPSUM
          </p>
        </div>

        <!-- Image à droite -->
        <div class="lg:w-1/2 flex justify-center">
          <img
            src="../img/APropos/img1.png"
            alt="WebTV Image"
            class="w-full max-w-lg rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>

    <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 mt-20 text-center">NOTRE AMBITION</h2>
    <div class="flex justify-center">
        <div class="h-3.5 w-1/3	 bg-orange-400 mb-20"></div>
    </div>
    <div class="relative w-full h-[70vh] bg-black">
    <!-- Image en pleine largeur -->
  <img 
    src="../img/APropos/img2.png" 
    alt="WebTV Image" 
    class="absolute inset-0 w-full h-full object-cover z-0"
  />

  <!-- Overlay pour foncer l'image -->
  <div class="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

  <!-- Texte superposé avec titre et deux colonnes -->
  <div class="relative z-20 flex flex-col h-full items-center justify-center text-white px-6 lg:px-20">
    <!-- Titre centré -->
    <h3 class="text-3xl font-bold mb-20 text-center">VOTRE FENETRE SUR LA VIE ETUDIANTE</h3>

    <div class="flex flex-col lg:flex-row justify-between w-full">
      <!-- Paragraphe gauche -->
      <div class="lg:w-1/2 text-left lg:pr-8">
        <p class="text-gray-200 text-lg">
          Notre ambition est de faire de la WebTV un véritable média de référence pour la vie étudiante, 
          un espace où chaque formation trouve sa voix et où chacun peut s’informer, partager et s’inspirer. 
          Par ce média, nous espérons également attirer et inspirer les futurs étudiants en leur offrant un 
          aperçu réaliste et engageant de la vie sur notre campus.
        </p>
      </div>

      <!-- Paragraphe droit -->
      <div class="lg:w-1/2 text-right lg:pl-8 mt-6 lg:mt-0">
        <p class="text-gray-200 text-lg">
          Nous souhaitons offrir à nos utilisateurs une expérience immersive et enrichissante, en diffusant 
          des contenus authentiques qui mettent en lumière la richesse et le dynamisme de l'IUT Nord Franche-Comté. 
          Cette plateforme vise à rassembler et valoriser les talents uniques qui animent notre communauté.
        </p>
      </div>
    </div>
  </div>
</div>


    <!-- Section NOTRE MISSION -->
    <div class="container mx-auto p-6 md:p-20">
      <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 mt-20 text-center">NOTRE MISSION</h2>
      <div class="flex justify-center">
        <div class="h-3.5 w-1/3	 bg-orange-400 mb-20"></div>
      </div>

      <div class="flex flex-col lg:flex-row items-center lg:items-start">
        <!-- Image à gauche -->
        <div class="lg:w-1/2 flex justify-center mb-6 lg:mb-0">
          <img
            src="../img/APropos/img3.png"
            alt="WebTV Image"
            class="w-full max-w-lg rounded-lg shadow-lg"
          />
        </div>

        <!-- Texte à droite -->
        <div class="lg:w-1/2 text-center lg:text-left">
          <p class="text-gray-300 text-justify mb-8">
            Notre mission est de créer un espace dynamique et inclusif qui informe, inspire et 
            valorise la communauté de l'IUT Nord Franche-Comté. Nous nous engageons à :
          </p>
          <ul class="list-disc list-inside text-gray-300 mt-4 text-justify">
            <p class="mb-4"><span class="font-bold">Informer et Inspirer :</span> Diffuser des informations utiles sur les formations, les débouchés, 
                et les projets étudiants, en donnant un aperçu concret de la vie à l’IUT.</p>
            <p class="mb-4"><span class="font-bold">Valoriser la diversité des parcours :</span> Donner une place à chaque formation et valoriser les 
                réussites de nos étudiants grâce à des témoignages et des reportages variés.</p>
            <p class="mb-4"><span class="font-bold">Créer un lien fort avec notre communauté :</span> En s’adressant aux étudiants actuels, aux futurs 
                étudiants, et à tous ceux qui souhaitent en savoir plus sur l'IUT, notre WebTV a pour mission 
                de rassembler et de renforcer l’esprit de communauté.</p>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
