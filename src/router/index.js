import router from './routers'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getAppToken } from '@/utils/auth' // getToken from cookie
import crudLogin from '@/api/app/login'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteListOfApp = ['/Home']// no redirect whitelist
router.beforeEach((to, from, next) => {
  NProgress.start()
  // 验证token
  if (getAppToken()) {
    next()
    NProgress.done()
  } else {
    // 白名单
    if (whiteListOfApp.indexOf(to.path) !== -1) {
      next()
    } else {
      crudLogin.getAuthUrl().then(res => {
        let redirect_uri = ''
        const index = res
        const paramStr = res.substring(index + 1, res.length)
        const params = paramStr.split('&')
        params.forEach(element => {
          if (element.indexOf('redirect_uri') >= 0) {
            redirect_uri = element.substring(element.indexOf('=') + 1, element.length)
          }
        })
        if (redirect_uri.indexOf(window.location.hostname) === -1) {
          window.open(res.replace(redirect_uri, window.location.protocol + '//' + window.location.host), '_self')
        } else {
          window.open(res, '_self')
        }
      }).catch(() => {})
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
