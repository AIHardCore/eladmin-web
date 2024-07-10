import request from '@/utils/request'

export function create(data) {
  return request({
    url: 'app/order',
    method: 'post',
    data
  })
}

export function find(data) {
  return request({
    url: 'app/order',
    method: 'get',
    data
  })
}

export default { create, find }
