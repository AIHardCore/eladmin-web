import request from '@/utils/request'

export function info() {
  return request({
    url: 'app/member/info',
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: 'app/member',
    method: 'put',
    data
  })
}

export default { info, save }
