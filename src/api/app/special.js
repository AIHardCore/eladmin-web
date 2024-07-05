import request from '@/utils/request'

export function list(data) {
  return request({
    url: 'app/special',
    method: 'get',
    data
  })
}

export function detail(data) {
  return request({
    url: 'app/special/' + data,
    method: 'get',
    data
  })
}
export default { list, detail }
