import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Constants from './constants'

import axios from 'axios';

import './assets/main.scss'

// Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || "https://staging-dl-api.spongeproject.net/api/v2/";

new Vue({
  data: {
    spr: window.localStorage.getItem(Constants.showExperimentalKey) === "true" ? true : false
  },
  computed: {
    showPreReleaseMC: {
      get: function() {
        return this.spr
      },
      set: function(value) {
        window.localStorage.setItem(Constants.showExperimentalKey, value);
        this.spr = value;
      }
    }
  },
  router,
  render: h => h(App)
}).$mount('#app');
