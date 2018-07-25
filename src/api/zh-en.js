import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取用户权限列表
export function getZhEnList(page) {
  const data = {
    pageNo: page || 1,
    pageSize: 10
  }

  return axios.post(
    `${url}/sys/msThematicMap/list.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取
export function addZhEn(data) {
  return axios.post(
    `${url}/sys/msThematicMap/insert.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 图片上传
export function uploadZhEnFile(data) {
  return axios.post(
    `${url}/sys/msThematicMap/importFile.do`,
    data,{  
      headers:{'Content-Type':'multipart/form-data'}  
    }).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除
export function deleteZhEn(data) {
  return axios.post(
    `${url}/sys/msThematicMap/delete.do`, qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}