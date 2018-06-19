import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取数据类型列表
export function getDataTypeList(page, name) {
  const data = {
    pageNo: page ||1,
    pageSize: 10,
    typename: name
  }

  return axios.post(
    `${url}/sys/msBaseContentTypeController/list.do`, qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取类型
export function getMsBaseContentTypeByItemid(id) {
  const data = {
    itemid: id || ''
  }

  return axios.post(
    `${url}/sys/msBaseContentTypeController/getMsBaseContentTypeByItemid.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据类型编码获取类型
export function getMsBaseContentTypeByTypeid(id) {
  const data = {
    typeid: id || ''
  }

  return axios.post(
    `${url}/sys/msBaseContentTypeController/getMsBaseContentTypeByTypeid.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 添加数据类型
export function addDataType(data) {
  return axios.post(
    `${url}/sys/msBaseContentTypeController/insert.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号修改数据类型
export function updateDataType(data) {
  return axios.post(
    `${url}/sys/msBaseContentTypeController/update.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除数据类型
export function deleteDataType(id) {
  const data = {
    itemid: id || ''
  }

  return axios.post(
    `${url}/sys/msBaseContentTypeController/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 批量删除数据类型
export function deleteDataTypes(ids) {
  const data = {
    itemids: ids || ''
  }

  return axios.post(
    `${url}/sys/msBaseContentTypeController/deletes.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}