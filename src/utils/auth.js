import Cookies from 'js-cookie'
import Config from '@/settings'
import router from '@/router/routers'

const AppTokenKey = Config.TokenKeyApp

export function getAppToken() {
  return Cookies.get(AppTokenKey)
}

export function setAppToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(AppTokenKey, token, { expires: Config.appTokenCookieExpires })
  } else return Cookies.set(AppTokenKey, token)
}

export function removeAppToken() {
  return Cookies.remove(AppTokenKey)
}

export function jumpToWx(url) {
  const ru = encodeURIComponent(window.location.protocol + '//' + window.location.host + (router.options.mode === 'hash' ? '/#/' : router.options.base) + 'Auth')
  debugger
  console.log(ru)
  url = url.replace('{REDIRECT_URI}', ru)
  window.open(url, '_self')
}
