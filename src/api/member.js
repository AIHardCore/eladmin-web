import request from '@/utils/request'

export function page() {
  return request({
    url: 'api/member?page=0&size=9999&notCreateBy=System',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/member',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/member/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/member',
    method: 'put',
    data
  })
}

export default { add, edit, del, page }
