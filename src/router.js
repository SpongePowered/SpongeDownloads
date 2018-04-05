import Vue from 'vue'
import Router from 'vue-router'
import Overview from './views/Overview.vue'
import Downloads from './views/Downloads.vue'
import {Platforms} from './platforms'

Vue.use(Router);

const router = new Router({
  base: process.env.BASE_URL,
  mode: 'history',
  routes: [
    {
      name: 'overview',
      path: '/',
      component: Overview
    },
    {
      name: 'downloads-project',
      path: '/:project',
      component: Downloads
    },
    {
      name: 'downloads-build-type',
      path: '/:project/:buildType',
      component: Downloads
    },
    {
      name: 'downloads',
      path: '/:project/:buildType/:category',
      component: Downloads
    }
  ]
});

router.afterEach(to => {
  const suffix = to.params.project ? Platforms[to.params.project].suffix : "";
  document.title = `Sponge${suffix} Downloads`
});

export default router;
