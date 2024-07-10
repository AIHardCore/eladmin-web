import Vue from 'vue'
import GlobalDrawer from './GlobalDrawer.vue'

let drawerInstance

const GlobalDrawerPlugin = {
  install(Vue, options) {
    Vue.prototype.$showGlobalDrawer = (propsData = {}, onCloseCallback) => {
      if (!drawerInstance) {
        // 创建一个GlobalDrawer的新实例
        drawerInstance = new Vue({
          render: h => h(GlobalDrawer, {
            props: {
              ...propsData,
              title: '图库',
              baseApi: process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API,
              onClose: (data) => {
                // 调用传入的回调函数，并可以传递参数
                onCloseCallback && onCloseCallback({ data })

                // 清理工作，比如移除DOM节点和销毁实例（如果需要）
                drawerInstance.$destroy()
                drawerInstance.$el.parentNode.removeChild(drawerInstance.$el)
                drawerInstance = null
              }
            }
          })
        }).$mount()
        // 将抽屉添加到body中
        document.body.appendChild(drawerInstance.$el)
      }
      drawerInstance.isVisible = true
    }
  }
}

Vue.use(GlobalDrawerPlugin)
