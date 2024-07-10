import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'app/auth/login',
    method: 'post',
    data
  })
}
export default { login }
