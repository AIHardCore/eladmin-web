import Vue from 'vue'

import 'normalize.css/normalize.css'

import permission from './components/Permission'

// global css
import './assets/styles/index.scss'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control

// 导入Vant2
import Vant, { Lazyload, Toast, Dialog } from 'vant'
import 'vant/lib/index.css'

Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(Toast)
Vue.use(Dialog)

Vue.use(permission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
