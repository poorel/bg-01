import request from '@/utils/request'

// P盘总数量接口
export function queryDeviceInfo(params) {
  return request({
    url: '/api/v1/device/report/totalp',
    method: 'get',
    params
  })
}

// 在线设备数量接口
export function queryDeviceStatusInfo(params) {
  return request({
    url: '/api/v1/device/report/onlinedevice',
    method: 'get',
    params
  })
}

// 删除
export function deleteDeviceInfo(params) {
  return request({
    url: '/api/v1/userinfo/delete',
    method: 'get',
    params
  })
}
