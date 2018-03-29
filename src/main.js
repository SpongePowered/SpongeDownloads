import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

import './assets/main.scss';

axios.defaults.baseURL = process.env.DOWNLOADS_API_URL || "https://dl-api.spongepowered.org/v1/";

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

// TODO: Replace
// Based on: http://stackoverflow.com/a/12809794
/* eslint-disable no-undef */
$('body').on('click.collapse-next.data-api', '[data-toggle=collapse-next]', function() {
    const $target = $(this).parent().children('.collapse');
    $target.data('bs.collapse') ? $target.collapse('toggle') : $target.collapse()
});
