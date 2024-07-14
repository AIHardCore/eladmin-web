import request from '@/utils/request'

export function list(data) {
  data['params'] = ''
  Object.keys(data).forEach(key => {
    if (data[key] instanceof Array) {
      Object.keys(data[key]).forEach(index => {
        data['params'] = data['params'].concat(data['params'].length === 0 ? '?' : '&', key).concat('=', data[key][index])
      })
    } else {
      data['params'] = data['params'].concat(data['params'].length === 0 ? '?' : '&', key).concat('=', data[key])
    }
  })
  return request({
    url: 'app/banner' + data['params'],
    method: 'get',
    data
  })
}

export default { list }
