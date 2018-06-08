import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取软件版本列表
export function getVersionList(page) {
  const data = {
    pageNo: page || 1,
    pageSize: 10
  }

  return axios.post(
    `${url}/sys/msVersion/list.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 添加版本
export function addVersion(data) {
  return axios.post(
    `${url}/sys/msVersion/insert.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取版本信息
export function getVersionById(id) {
  const data = {
    vId: id
  }

  return axios.post(
    `${url}/sys/msVersion/get.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除版本
export function deleteVersion(id) {
  const data = {
    vId: id
  }

  return axios.post(
    `${url}/sys/msVersion/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 批量删除
export function deleteVersions(id) {
  const data = {
    vId: id
  }

  return axios.post(
    `${url}/sys/msVersion/deletes.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}