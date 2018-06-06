import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取区域列表
export function getAreaList(page) {
  const data = {
    pageNo: page || 1,
    pageSize: 40
  }

  return axios.post(
    `${url}/sys/msAreaCode/list.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 获取目录带区域
export function getAreaCatalog() {

  return axios.post(
    `${url}/sys/msTabDataController/getGroupDataTreeAllByParentid.do`).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取目录信息
export function getMsTabDatainfoById(id) {
  const data = {
    id: id
  }

  return axios.post(
    `${url}/sys/msTabDataController/getMsTabDatainfo.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 修改目录信息
export function updateMsTabDatainfo() {
  return axios.post(
    `${url}/sys/msTabDataController/update.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除目录
export function deleteMsTabDatainfo(id) {
  const data = {
    id: id
  }

  return axios.post(
    `${url}/sys/msTabDataController/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 导入数据
export function importMsTabFile(data) {
  return axios.post(
    `${url}/sys/msTabDataController/importFile.do`,
    data,{  
      headers:{'Content-Type':'multipart/form-data'}  
    }).then(res => {
      return Promise.resolve(res.data)
  })
}