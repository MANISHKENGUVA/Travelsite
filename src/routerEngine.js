// src/routerEngine.js
import Welcome from './compo/Welcome.vue'; // or correct path
import Cards from './compo/Cards.vue';
import OfferTransCard from './compo/OfferTransCard.vue';
import Statsgrid from './compo/Statsgrid.vue';
import Recent from './compo/Recent.vue';
import QuickStats from './compo/QuickStats.vue';
import Stars from './compo/Stars.vue';
import Layout from './compo/Layout.vue';
export default function registerGlobalComponents(app) {
  app.component('Welcome', Welcome);
  app.component('Cards', Cards);
  app.component('OfferTransCard', OfferTransCard);
  app.component('StatsGridUser', Statsgrid);
  app.component('RecentActivity', Recent);
  app.component('QuickStats',QuickStats);
  app.component('Stars',Stars);
  app.component('Layout', Layout);
  app.component('Rating', () => import('./compo/Rating.vue')); // Lazy load Rating component
}
