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

import './plugins/vant'

import './assets/styles/common.css'

Vue.use(permission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

const version = require('../package.json').version
const versionStorage = localStorage.getItem('version')
if (version !== versionStorage) {
  localStorage.clear()
  localStorage.setItem('version', version)
  setTimeout(() => {
    window.location.reload(true)
  }, 500)
}
