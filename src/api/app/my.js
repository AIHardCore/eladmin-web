import request from '@/utils/request'

export function info() {
  return request({
    url: 'app/auth/info',
    method: 'get'
  })
}

export default { info }
