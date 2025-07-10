// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import registerGlobalComponents from './routerEngine';
import '@fortawesome/fontawesome-free/css/all.min.css';

import store from './store';


// const user = JSON.parse(localStorage.getItem('user'));
// if (user) {
//   store.commit('setUser', user.email);
//   store.commit('setUserDetails', user.email);
// }
const app = createApp(App);
app.use(store);

registerGlobalComponents(app); 
app.use(router);
app.mount('#app');
