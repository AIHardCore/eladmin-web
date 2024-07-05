import request from '@/utils/request'

export function info(data) {
  return request({
    url: 'app/member/' + data,
    method: 'get'
  })
}

export default { info }
