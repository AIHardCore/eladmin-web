import Vue from 'vue'
import GlobalDrawer from './GlobalDrawer.vue'

const GlobalDrawerConstructor = Vue.extend(GlobalDrawer)

let drawerInstance

const GlobalDrawerPlugin = {
  install(Vue, options) {
    Vue.prototype.$showGlobalDrawer = () => {
      if (!drawerInstance) {
        drawerInstance = new GlobalDrawerConstructor({
          propsData: {
            title: '图库',
            baseApi: process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
          }
        })
        drawerInstance.$mount()
        document.body.appendChild(drawerInstance.$el)
      }
      drawerInstance.isVisible = true
    }
  }
}

Vue.use(GlobalDrawerPlugin)
