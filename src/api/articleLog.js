import request from '@/utils/request'

export function findByArticleId(data) {
  return request({
    url: 'api/articleLog/all?articleId=' + data,
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: 'api/articleLog',
    method: 'post',
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

export function top(data) {
  return request({
    url: 'api/article/top',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/articleLog/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/articleLog',
    method: 'put',
    data
  })
}

export default { add, edit, del, findByArticleId, enabled, top }
