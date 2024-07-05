import request from '@/utils/request'

export function page(data) {
  return request({
    url: 'app/rank?page=0&size=10&sort=sort,asc&type=' + data,
    method: 'get',
    data
  })
}

export default { page }
