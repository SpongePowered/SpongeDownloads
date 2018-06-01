import Vue from 'vue'
import App from './App.vue'
import router from './router'

import fontawesome from '@fortawesome/fontawesome'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft'
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

import axios from 'axios';

import './assets/main.scss'

// Font Awesome
fontawesome.library.add(faDownload, faChevronLeft, faChevronRight);
Vue.component('font-awesome-icon', FontAwesomeIcon);

// Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || "https://dl-api.spongepowered.org/v1/";

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
