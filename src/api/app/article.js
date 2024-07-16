import request from '@/utils/request'

export function read(data) {
  return request({
    url: 'app/article/' + data,
    method: 'get'
  })
}

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
    url: 'app/article' + data['params'],
    method: 'get'
  })
}

export default { read, list }
