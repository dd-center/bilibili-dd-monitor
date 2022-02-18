import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'
import {
  AppUpdateListener,
  CDNListener,
  FollowListService,
  NoticeListener,
  PlayerWindowCountListener,
  VtbInfoUpdateListener
} from '@/app/services'

// import font awesome icon
// https://github.com/FortAwesome/vue-fontawesome#installation
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBan,
  faCog,
  faEllipsisV,
  faGlobe,
  faHeart,
  faListUl,
  faPlusCircle,
  faSearch,
  faSignal,
  faUserFriends,
  faPaperPlane,
  faHome
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// https://vue-select.org/guide/
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

// https://github.com/euvl/vue-notification/
import Notifications from 'vue-notification'
import { FollowList } from '@/interfaces'

import OrbitSpinner from '@/app/components/OrbitSpinner.vue'
import { slog } from '@/app/utils/helpers'

library.add(
  faSignal,
  faHeart,
  faListUl,
  faCog,
  faPlusCircle,
  faGlobe,
  faUserFriends,
  faBan,
  faSearch,
  faEllipsisV,
  faPaperPlane,
  faHome
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component('v-select', vSelect)

Vue.component('orbit-spinner', OrbitSpinner)

Vue.config.productionTip = false

Vue.use(Notifications)

Vue.mixin({
  methods: {
    actionNotify: (type, text) => {
      Vue.notify({
        group: 'action-feedback',
        // @ts-ignore
        position: 'top',
        duration: 1500,
        type: type,
        text: text
      })
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    const noticeService = new NoticeListener()
    slog('INIT', 'NoticeService')
    const followListService = new FollowListService()
    followListService.getFollowLists().subscribe((followLists: FollowList[]) => {
      slog('INIT', 'followlists')
      store.dispatch('updateFollowLists', followLists)
    })
    const vtbInfoUpdateListenerService = new VtbInfoUpdateListener()
    slog('INIT', 'VtbInfoUpdateListener')
    const playerWindowCountListener = new PlayerWindowCountListener()
    slog('INIT', 'PlayerWindowCountListener')
    const cdnListener = new CDNListener()
    slog('INIT', 'CDNListener')
    const appUpdateListener = new AppUpdateListener()
    slog('INIT', 'appUpdateListener')
  }
}).$mount('#app')
