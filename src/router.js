import Vue from 'vue'
import Router from 'vue-router'
import Overview from './views/Overview.vue'
import Downloads from './views/Downloads.vue'
import Settings from './views/Settings.vue'
import {Platforms} from './platforms'

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      name: 'overview',
      path: '/',
      component: Overview
    },
    {
      name: 'settings',
      path: '/settings',
      component: Settings
    },
    {
      name: 'downloads',
      path: '/:project',
      component: Downloads
    }
  ]
});

router.afterEach(to => {
  if (to.params.project) {
    const platform = Platforms[to.params.project]
    const suffix = platform ? platform.suffix : "";
    document.title = `Sponge${suffix} Downloads`
  } else {
    document.title = `Sponge Downloads`
  }
});

export default router;
