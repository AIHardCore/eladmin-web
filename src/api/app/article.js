import request from '@/utils/request'

export function read(data) {
  return request({
    url: 'app/article/' + data,
    method: 'get'
  })
}

export function list(data) {
  Object.keys(data.sort).forEach(key => {
    data.sortStr += '&sort=' + data.sort[key]
  })
  return request({
    url: 'app/article?page=' + data.page + '&size=' + data.size + data.sortStr,
    method: 'get',
    data
  })
}

export default { read, list }
