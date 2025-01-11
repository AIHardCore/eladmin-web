import request from '@/utils/request'

export function list(data) {
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
    url: 'app/articlesSpecials' + data['params'],
    method: 'get'
  })
}

export function all(data) {
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
    url: 'app/articlesSpecials/all' + data['params'],
    method: 'get'
  })
}

export default { list, all }
