import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import VtbLiving from '../views/VtbLiving.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'VtbLiving',
    component: VtbLiving
  },
  {
    path: '/follow',
    component: () => import('../views/Follow.vue'),
    children: [
      {
        path: '',
        redirect: '/list/-1'
      },
      {
        path: '/list/:id',
        component: () => import('../components/FollowList.vue')
      }
    ]
  },
  {
    path: '/vtbList',
    name: 'VtbList',
    component: () => import('../views/VtbList.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  }
]

const router = new VueRouter({
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html#blank-screen-on-builds-but-works-fine-on-serve
  // mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
