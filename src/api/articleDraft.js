import request from '@/utils/request'

export function findById(data) {
  return request({
    url: 'api/articleDraft/find/' + data,
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/articleDraft',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/articleDraft/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/articleDraft',
    method: 'put',
    data
  })
}

export default { add, edit, del, findById }
