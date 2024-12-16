import request from '@/utils/request'

export function loginCount() {
  return request({
    url: 'api/statistics/login/count',
    method: 'get'
  })
}

export function loginLogs(success) {
  return request({
    url: 'api/statistics/login/logs/' + success,
    method: 'get'
  })
}

export function orderSum() {
  return request({
    url: 'api/statistics/order',
    method: 'get'
  })
}

export function orderLogs(status) {
  return request({
    url: 'api/statistics/order/logs/' + status,
    method: 'get'
  })
}

export function orderLogsOfPre(status) {
  return request({
    url: 'api/statistics/order/logsOfMonth/pre/' + status,
    method: 'get'
  })
}

export function orderLogsOfMonth(status) {
  return request({
    url: 'api/statistics/order/logsOfMonth/' + status,
    method: 'get'
  })
}

export function orderLogsOfHour(status) {
  return request({
    url: 'api/statistics/order/logsOfHour/' + status,
    method: 'get'
  })
}

export default { loginCount, loginLogs, orderSum, orderLogs, orderLogsOfPre, orderLogsOfMonth, orderLogsOfHour }
