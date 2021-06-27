import request from '@/utils/request'

// 客户列表
export function queryDeviceInfo(params) {
  return request({
    url: '/api/v1/customerinfo/findall',
    method: 'get',
    params
  })
}
// 新增客户
export function postDeviceConfigInfo(params) {
  return request({
    url: '/api/v1/customerinfo/save',
    method: 'post',
    params,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    }
  })
}
// 保存硬盘详情
export function saveDeviceConfigInfo(params) {
  return request({
    url: '/api/v1/deviceconfig/saveDeviceConfigInfo',
    method: 'post',
    params
  })
}

// ppk
export function saveDevicePPKConfigInfo(params) {
  console.log(params)
  return request({
    url: '/api/v1/deviceconfig/saveDevicePPKConfigInfo',
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    params
  })
}

// 设备状态
export function queryDeviceStatusInfo(params) {
  return request({
    url: '/api/v1/devicestatus/queryDeviceStatusInfo',
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
