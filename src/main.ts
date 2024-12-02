import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Importer les composants pour les routes
import Home from './views/Home.vue';
import AboutView from './views/AboutView.vue';
import CarouselView from './views/CarouselTest.vue';
import Carousel from './views/CarouselTestAPI.vue';
import SingleVideoComponent from './views/PageSingleVideo.vue'; 
import CarouselTest from './views/Carouseltstapi.vue';
import PocketbaseTest from './views/PocketbaseTest.vue';
import SingleVideoPocketbase from './views/PageSingleVideoPocketbase.vue';
import HomePocketbase from './views/HomePocketbase.vue';
import SinglePocketbase2 from './views/PageSingleVideoPocketbase2.vue';

// Définir les routes
const routes = [
  { path: '/', component: HomePocketbase },      
  { path: '/about', component: AboutView },
  { path: '/carousel', component: CarouselView },
  { path: '/carouselAPI', component: Carousel },
  { path : '/carouseltest', component: CarouselTest },
  { path: '/video/:id', name: 'singleVideo', component: SingleVideoComponent }, 
  { path: '/pocketbasetest', component: PocketbaseTest },
  { path: '/singlepocketbase/:id', name: 'singleVideoPocket', component: SingleVideoPocketbase },
  { path: '/singlepocketbase2/:id', name: 'singleVideoPocket2', component: SinglePocketbase2 },
  { path: '/homepocket', component:Home }
];

const router = createRouter({
  history: createWebHistory(),
  routes, 
});

const app = createApp(App);

app.use(router);

app.mount('#app');
