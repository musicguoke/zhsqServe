import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取软件版本列表
export function getVersionDescList(page) {
  const data = {
    pageNo: page || 1,
    pageSize: 10
  }

  return axios.post(
    `${url}/sys/msVersionDescp/list.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取版本信息
export function getVersionDescById(id) {
  const data = {
    id: id
  }

  return axios.post(
    `${url}/sys/msVersionDescp/get.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除版本
export function deleteVersionDesc(id) {
  const data = {
    id: id
  }

  return axios.post(
    `${url}/sys/msVersionDescp/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 上传软甲版本
export function uploadVersionDesc(data) {
  return axios.post(
    `${url}/sys/msVersionDescp/uploadImage.do`,
    data,{  
      headers:{'Content-Type':'multipart/form-data'}  
    }).then(res => {
      return Promise.resolve(res.data)
  })
}