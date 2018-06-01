import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios';

import './assets/main.scss'

// Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || "https://dl-api.spongepowered.org/v1/";

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
