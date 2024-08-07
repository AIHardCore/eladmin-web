import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/localStorage',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/localStorage/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/localStorage',
    method: 'put',
    data
  })
}

export function find(data) {
  return request({
    url: 'api/localStorage?page=' + data.page + '&size=' + data.size + '&type=' + data.type,
    method: 'get',
    data
  })
}

export default { add, edit, del, find }
