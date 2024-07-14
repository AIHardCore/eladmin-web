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

export function enabled(data) {
  return request({
    url: 'api/article/enabled',
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

export function find(data) {
  return request({
    url: 'api/article/find?title=' + data,
    method: 'get'
  })
}

export function page(data) {
  return request({
    url: 'api/article?size=' + data,
    method: 'get'
  })
}

export default { add, edit, del, detail, find, page, enabled }
