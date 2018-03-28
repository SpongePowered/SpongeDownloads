import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueResource from 'vue-resource';

import './assets/main.scss';

Vue.use(VueResource);

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
