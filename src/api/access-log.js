import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取用户权限列表
export function getLogList(page) {
  const data = {
    pageNo: page || 1,
    pageSize: 10
  }

  return axios.post(
    `${url}/sys/msLog/list.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取
export function getLogById(id) {
  const data = {
    id: id
  }
  return axios.post(
    `${url}/sys/msLog/get.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除统计分析
export function deleteLogById(id) {
  const data = {
    id: id
  }
  return axios.post(
    `${url}/sys/msLog/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 批量删除统计分析
export function deleteLogsById(id) {
  const data = {
    idStr: id
  }
  return axios.post(
    `${url}/sys/msLog/deletes.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}