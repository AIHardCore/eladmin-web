import request from '@/utils/request'

export function page(data) {
  data['params'] = ''
  Object.keys(data).forEach(key => {
    if (key === 'params') return
    if (data[key] instanceof Array) {
      Object.keys(data[key]).forEach(index => {
        data['params'] = data['params'].concat(data['params'].length === 0 ? '?' : '&', key).concat('=', data[key][index])
      })
    } else {
      data['params'] = data['params'].concat(data['params'].length === 0 ? '?' : '&', key).concat('=', data[key])
    }
  })
  return request({
    url: 'app/comment' + data['params'],
    method: 'get',
    data
  })
}

export function add(data) {
  return request({
    url: 'app/comment',
    method: 'post',
    data
  })
}

export function like(data) {
  return request({
    url: 'app/comment/like/' + data,
    method: 'put'
  })
}

export function unlike(data) {
  return request({
    url: 'app/comment/unlike/' + data,
    method: 'put'
  })
}

export function del(ids) {
  return request({
    url: 'app/comment/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'app/comment',
    method: 'put',
    data
  })
}

export default { page, add, edit, del, like, unlike }
