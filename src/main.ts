import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Importer les composants pour les routes

import AboutView from './views/AboutView.vue';
import SingleVideoComponent from './views/PageSingleVideo.vue'; 
import SingleVideoPocketbase from './views/PageSingleVideoPocketbase.vue';
import HomePocketbase from './views/HomePocketbase.vue';
import SinglePocketbase2 from './views/PageSingleVideoPocketbase2.vue';
import NewsRoom from './views/NewsRoom.vue';
import Rediffusions from './views/Rediffusions.vue';
import Reportages from './views/Reportages.vue';
import Emissions from './views/Emissions.vue';
import APropos from './views/APropos.vue';
import SingleLive from './views/SingleLive.vue';
import ConditionUtilisation from './views/ConditionUtilisation.vue';
import PolitiqueDeConfidentialiteVue from './views/PolitiqueDeConfidentialite.vue';
import MentionsLegalesVue from './views/MentionsLegales.vue';
import PolitiqueCookiesVue from './views/PolitiqueCookies.vue';
import YouTubeLive from './views/YouTubeLive.vue';

// Définir les routesdv
const routes = [
  { path: '/', component: HomePocketbase },      
  { path: '/about', component: AboutView },


  { path: '/video/:id', name: 'singleVideo', component: SingleVideoComponent }, 

  { path: '/singlepocketbase/:id', name: 'singleVideoPocket', component: SingleVideoPocketbase },
  { path: '/singlepocketbase2/:id', name: 'singleVideoPocket2', component: SinglePocketbase2 },
  { path: '/newsroom', component: NewsRoom },
  { path: '/rediffusions', component: Rediffusions },
  { path: '/reportages', component: Reportages },
  { path: '/emissions', component: Emissions },
  { path: '/apropos', component: APropos },
  { path: '/singlelive', component: SingleLive, name: 'singleLive'},
  { path: '/conditionutilisation', component: ConditionUtilisation},
  { path: '/politiquedeconfidentialite', component: PolitiqueDeConfidentialiteVue},
  { path: '/mentionslegales', component: MentionsLegalesVue },
  { path: '/politiquecookies' , component: PolitiqueCookiesVue},
  { path: '/youtubelive', component: YouTubeLive},
];

const router = createRouter({
  history: createWebHistory(),
  routes, 
});

const app = createApp(App);

app.use(router);

app.mount('#app');
