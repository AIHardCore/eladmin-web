import router from './routers'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getAppToken, jumpToWx } from '@/utils/auth' // getToken from cookie
import crudLogin from '@/api/app/login'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteListOfApp = ['/Auth']// no redirect whitelist
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
        jumpToWx(res)
      }).catch(() => {})
    }
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
