import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'app/auth/login',
    method: 'post',
    data
  })
}

export function getAuthUrl() {
  return request({
    url: 'app/wx/url/code',
    method: 'get'
  })
}
export default { login, getAuthUrl }
