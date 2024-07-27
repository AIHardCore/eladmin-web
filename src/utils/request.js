import axios from 'axios'
import router from '@/router/routers'
import { Notify } from 'vant'
import store from '../store'
import { getAppToken, jumpToWx } from '@/utils/auth'
import Config from '@/settings'
import Cookies from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (getAppToken()) {
      config.headers['Token'] = getAppToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        const errorMsg = JSON.parse(reader.result).message
        Notify({
          type: 'warning',
          message: errorMsg,
          duration: 5000
        })
      }
    } else {
      let code = 0
      try {
        code = error.response.data.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notify({
            type: 'warning',
            message: '网络请求超时',
            duration: 5000
          })
          return Promise.reject(error)
        }
      }
      console.log(code)
      if (code) {
        if (code === 401) {
          store.dispatch('LogOut').then(() => {
            // 用户登录界面提示
            Cookies.set('point', 401)
            location.reload()
          })
        } else if (code === 403) {
          router.push({ path: '/401' })
        } else if (code === 1001) { // App端未登录，跳转到微信授权页面
          if (store.getters.hasJump) return
          store.dispatch('app/jump', true)
          jumpToWx(error.response.data.message)
        } else if (code === 500) {
          console.log(error.response.data.message)
          if (error.response.data.message.indexOf('获取AccessToken信息失败') === -1) {
            Notify({
              type: 'warning',
              message: '服务器开小差了，再试一下吧',
              duration: 5000
            })
          }
        } else {
          const errorMsg = error.response.data.message
          if (errorMsg !== undefined) {
            console.log(errorMsg)
            Notify({
              type: 'warning',
              message: '服务器开小差了，再试一下吧',
              duration: 5000
            })
          }
        }
      } else {
        Notify({
          type: 'warning',
          message: '接口请求失败',
          duration: 5000
        })
      }
    }
    return Promise.reject(error)
  }
)
export default service
