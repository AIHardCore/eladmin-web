import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/article',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/article/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/article/',
    method: 'put',
    data
  })
}

export function detail(data) {
  return request({
    url: 'api/articleBody/' + data,
    method: 'get'
  })
}

export default { add, edit, del, detail }
