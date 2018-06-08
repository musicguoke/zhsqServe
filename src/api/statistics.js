import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取统计分析列表
export function getStatisticList(page) {
  const data = {
    pageNo: page || 1,
    pageSize: 10
  }

  return axios.post(
    `${url}/sys/msStatisticalConfigController/list.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 添加统计分析
export function addStatistic(data) {
  return axios.post(
    `${url}/sys/msStatisticalConfigController/insert.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 编辑统计分析
export function updateStatistic(data) {
  return axios.post(
    `${url}/sys/msStatisticalConfigController/update.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取
export function getStatistic(id) {
  const data = {
    id: id
  }
  return axios.post(
    `${url}/sys/msStatisticalConfigController/getMsMapConfig.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除统计分析
export function deleteStatistic(id) {
  const data = {
    id: id
  }
  return axios.post(
    `${url}/sys/msStatisticalConfigController/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 批量删除统计分析
export function deleteStatistics(id) {
  const data = {
    ids: id
  }
  return axios.post(
    `${url}/sys/msStatisticalConfigController/deletes.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 导入数据
export function importStatisticFile(data) {
  return axios.post(
    `${url}/sys/msStatisticalConfigController/importFile.do`,
    data,{  
      headers:{'Content-Type':'multipart/form-data'}
    }).then(res => {
      return Promise.resolve(res.data)
  })
}