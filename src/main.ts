import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'
import { FollowListService, NoticeService, VtbInfoUpdateListenerService } from '@/app/services'

// import font awesome icon
// https://github.com/FortAwesome/vue-fontawesome#installation
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSignal,
  faHeart,
  faListUl,
  faCog,
  faPlusCircle,
  faGlobe,
  faUserFriends,
  faBan,
  faSearch,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// https://vue-select.org/guide/
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

// https://github.com/euvl/vue-notification/
import Notifications from 'vue-notification'
import { FollowList, VtbInfo } from '@/interfaces'
import PlayerWindowCountListener from '@/app/services/PlayerWindowCountListener'

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
  faEllipsisV
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.component('v-select', vSelect)

Vue.config.productionTip = false

Vue.use(Notifications)

declare const window: any
export const slog = (title: any, content: any): void => {
  window.slog({ title: title, content: content })
}

export const _compareByOnlineDesc = (vtbInfoA: VtbInfo, vtbInfoB: VtbInfo): number => {
  return vtbInfoB.online - vtbInfoA.online
}

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
    const noticeService = new NoticeService()
    slog('INIT', 'NoticeService')
    const followListService = new FollowListService()
    followListService.getFollowLists().subscribe((followLists: FollowList[]) => {
      slog('INIT', 'followlists')
      store.dispatch('updateFollowLists', followLists)
    })
    const vtbInfoUpdateListenerService = new VtbInfoUpdateListenerService()
    slog('INIT', 'VtbInfoUpdateListenerService')
    const playerWindowCountListener = new PlayerWindowCountListener()
    slog('INIT', 'playerWindowCountListener')
  }
}).$mount('#app')
