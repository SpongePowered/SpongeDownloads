import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/Main.vue'
import Downloads from './views/Downloads.vue'

Vue.use(Router);

export default new Router({
    mode: 'history',
    linkActiveClass: 'current',
    routes: [
        {
            name: 'root',
            path: '/',
            component: Main,
        },
        {
            name: 'main',
            path: '/downloads',
            component: Main
        },
        {
            name: 'downloads-project',
            path: '/downloads/:project',
            component: Downloads
        },
        {
            name: 'downloads-build-type',
            path: '/downloads/:project/:buildType',
            component: Downloads
        },
        {
            name: 'downloads',
            path: '/downloads/:project/:buildType/:category',
            component: Downloads
        }
    ]
})
