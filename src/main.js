import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios';

import './assets/main.scss'

// Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || "https://staging-dl-api.spongeproject.net/api/v2/";

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
