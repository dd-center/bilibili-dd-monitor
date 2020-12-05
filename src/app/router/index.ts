import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import VtbLiving from '../views/VtbLiving.vue'
import Follow from '../views/Follow.vue'
import VtbList from '../views/VtbList.vue'
import Setting from '../views/Setting.vue'
import FollowList from '../components/FollowList.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'VtbLiving',
    component: VtbLiving
  },
  {
    path: '/follow',
    component: Follow,
    children: [
      {
        path: '',
        redirect: '/list/-1'
      },
      {
        path: '/list/:id',
        component: FollowList
      }
    ]
  },
  {
    path: '/vtbList',
    name: 'VtbList',
    component: VtbList
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  }
]

const router = new VueRouter({
  // https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/commonIssues.html#blank-screen-on-builds-but-works-fine-on-serve
  // mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
