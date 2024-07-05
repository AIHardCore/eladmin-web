import request from '@/utils/request'

export function list(data) {
  Object.keys(data.sort).forEach(key => {
    data.sortStr += '&sort=' + data.sort[key]
  })
  return request({
    url: 'app/banner?page=' + data.page + '&size=' + data.size + '&enabled=' + data.enabled + data.sortStr,
    method: 'get',
    data
  })
}

export default { list }
