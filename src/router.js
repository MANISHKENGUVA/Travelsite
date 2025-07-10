// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from "./pages/Home.vue"
import store from './store';
import { decryptUserData } from './cry'; // Import the decryption function


// Import your pages

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/post-delivery',
    name: 'PostDeliveryForm',
    component: () => import('./pages/PostDeliveryForm.vue'),
  },
   {
    path: '/post-trip',
    name: 'Post-trip',
    component: () => import('./pages/PostTrip.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./pages/Dashboard.vue'),
  },
    {
    path: '/carrier-dashboard',
    name: 'Carrier Dashboard',
    component: () => import('./pages/carrier-dashboard.vue'),
  },
   {
    path: '/find-carriers',
    name: 'find-carriers',
    component: () => import('./pages/find-carriers.vue'),
  },
   {
    path: '/customerchat/support',
    name: 'customerchat-support',
    component: () => import('./pages/for-customer-chat.vue'),
  },
    {
    path: '/profile',
    name: 'profile',
    component: () => import('./pages/Profile.vue'),
  },
   {
    path: '/sender-dashboard',
    name: 'sender-dasnhboard',
    component: () => import('./pages/sender-dashboard.vue'),
  },
  {
    path: '/view-requests',
    name: 'view-requests',
    component: () => import('./pages/view-requests.vue'),
  },
 
 
 {
        path: '/userchat/:id', // Dynamic segment for user ID
        component: () => import('./pages/userchat.vue'),
      },
      {
        path: '/cnf-delivery/:id', // Dynamic segment for user ID
        component: () => import('./pages/cnf-delivery.vue'),
      },
        {
        path: '/blob',
        name: 'blob',
        component: () => import('./pages/blob.vue'),
        },
            {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('./pages/Signup.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('./pages/ResetPassword.vue'),
  },
 
  {
    path: '/help',
    name: 'Help',
    component: () => import('./pages/help.vue'),
  },
  
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('./pages/settings.vue'),
  },
  {
    path: '/new-request/:id',
    name: 'new-request',
    component: () => import('./pages/NewRequestDetails.vue'),
    props: true
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('./pages/MessagesPage.vue'), 
  },
  {
    path: '/updates', // Define the path for the updates page
    name: 'Updates',
    component: ()=> import('./pages/UpdatesPage.vue'), 
  }
];

const router = createRouter({
  history: createWebHistory(), // Uses clean URLs without #
  routes,
});

router.beforeEach((to, from, next) => {
  const x = localStorage.getItem('user');
  const user =decryptUserData(x);
  // const user= localStorage.getItem('user');

  console.log('User from localStorage:', user);
  alert('User from localStorage: ' + user);
  if (user) {
     store.commit('setUser', user.email);
    store.commit('setUserDetails', user.email);
    console.log('User is logged in:', user.email);
  }
  

  // Redirect unauthenticated users trying to access protected routes
  if (!user && to.path !== '/login' && to.path !== '/signup' ) {
    return next('/login');
  }

  // Redirect logged-in users away from login/signup pages
  if (user && (to.path === '/login' || to.path === '/signup')) {
    // ✅ Correct way to use store

  
   

    alert(`Welcome back, ${user.email}!`);
    return next('/');
  }

  // Allow navigation
  next();
});


export default router;
