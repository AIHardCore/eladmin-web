import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey

const AppTokenKey = Config.TokenKeyApp

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getAppToken() {
  return Cookies.get(AppTokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: Config.tokenCookieExpires })
  } else return Cookies.set(TokenKey, token)
}

export function setAppToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(AppTokenKey, token, { expires: Config.appTokenCookieExpires })
  } else return Cookies.set(AppTokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeAppToken() {
  return Cookies.remove(AppTokenKey)
}
