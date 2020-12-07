import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'
import { NoticeService } from '@/app/services'

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

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    const noticeService = new NoticeService()
    console.log('init notice service in app.')
  }
}).$mount('#app')
