import Vue from 'vue'
import App from './app/App.vue'
import router from './app/router'
import store from './app/store'

// import font awesome icon
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
