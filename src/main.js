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

import './assets/styles/common.css'

// 导入Vant2
import {
  Image as VanImage,
  Lazyload,
  List,
  Tab,
  Tabs,
  Field,
  Form,
  Button,
  Toast,
  Dialog,
  Col,
  Row,
  Swipe,
  SwipeItem,
  Tabbar,
  TabbarItem,
  Card,
  Search,
  Divider,
  Collapse,
  CollapseItem,
  Icon
} from 'vant'
import 'vant/lib/index.css'

Vue.use(VanImage)
Vue.use(Lazyload)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Field)
Vue.use(Form)
Vue.use(Button)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Col)
Vue.use(Row)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Card)
Vue.use(Search)
Vue.use(Divider)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Icon)

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
