import axios from 'axios'
import router from '@/router/routers'
import { Notify } from 'vant'
import store from '../store'
import { getAppToken, getToken } from '@/utils/auth'
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
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
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
          let redirect_uri = ''
          const index = error.response.data.message
          const paramStr = error.response.data.message.substring(index + 1, error.response.data.message.length)
          const params = paramStr.split('&')
          params.forEach(element => {
            if (element.indexOf('redirect_uri') >= 0) {
              redirect_uri = element.substring(element.indexOf('=') + 1, element.length)
            }
          })
          debugger
          if (redirect_uri.indexOf(window.location.hostname) === -1) {
            window.open(error.response.data.message.replace(redirect_uri, window.location.protocol + '//' + window.location.host), '_self')
          } else {
            window.open(error.response.data.message, '_self')
          }
        } else if (code === 500) {
          Notify({
            type: 'warning',
            message: '服务器开小差了，再试一下吧',
            duration: 5000
          })
        } else {
          const errorMsg = error.response.data.message
          if (errorMsg !== undefined) {
            Notify({
              type: 'warning',
              message: errorMsg,
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
