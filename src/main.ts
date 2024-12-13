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
import NewsRoom from './views/NewsRoom.vue';
import Rediffusions from './views/Rediffusions.vue';
import Reportages from './views/Reportages.vue';
import Emissions from './views/Emissions.vue';
import APropos from './views/APropos.vue';
import SingleLive from './views/SingleLive.vue';
import Test from './views/Test.vue';

// Définir les routesdv
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
  { path: '/newsroom', component: NewsRoom },
  { path: '/rediffusions', component: Rediffusions },
  { path: '/reportages', component: Reportages },
  { path: '/emissions', component: Emissions },
  { path: '/apropos', component: APropos },
  { path: '/homepocket', component:Home },
  { path: '/singlelive', component: SingleLive, name: 'singleLive'},
  { path: '/test', component: Test, name: 'homepocketbase_copy' },
];

const router = createRouter({
  history: createWebHistory(),
  routes, 
});

const app = createApp(App);

app.use(router);

app.mount('#app');
