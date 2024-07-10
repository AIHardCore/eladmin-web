import request from '@/utils/request'

export function get() {
  return request({
    url: 'api/wx',
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: 'api/wx',
    data,
    method: 'put'
  })
}

// 支付
export function toAliPay(url, data) {
  return request({
    url: 'api/' + url,
    data,
    method: 'post'
  })
}
