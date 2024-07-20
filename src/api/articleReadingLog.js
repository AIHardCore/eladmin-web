import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/articleReadingLog',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'api/articleReadingLog',
    method: 'put',
    data
  })
}

export default { add, edit }
