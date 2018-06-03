import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 获取专题树
export function getTopicDataTree(id) {
  const data = {
    parentid: id
  }

  return axios.post(
    `${url}/sys/msDataPublish/getDataTree.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取信息
export function getTopicDataById(id) {
  const data = {
    dpId: id
  }

  return axios.post(
    `${url}/sys/msDataPublish/get.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 添加专题
export function addTopicData(data) {
  return axios.post(
    `${url}/sys/msDataPublish/insert.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 修改
export function updateTopicData(data) {
  return axios.post(
    `${url}/sys/msDataPublish/update.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 添加专题下目录
export function addCatalogToTopic(data) {
  return axios.post(
    `${url}/sys/msDataPublish/insertData.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除专题
export function deleteTopicData(id) {
  const data = {
    dpId: id
  }

  return axios.post(
    `${url}/sys/msDataPublish/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}