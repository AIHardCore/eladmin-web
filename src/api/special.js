import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/special',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/special/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/special',
    method: 'put',
    data
  })
}

// 获取所有的Role
export function getAll() {
  return request({
    url: 'api/special/all',
    method: 'get'
  })
}

export default { add, edit, del, getAll }
