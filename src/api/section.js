import request from '@/utils/request'

export function getAllSection() {
  const params = {
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/section',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/section',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/section/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/section',
    method: 'put',
    data
  })
}

export default { add, edit, del }
