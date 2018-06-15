import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

//意见列表
export function getSuggestList(page) {
  const data = {
    pageNo: page || 1,
    pageSize: 10
  }

  return axios.post(`${url}/sys/msSuggest/list.do`, qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

//修改意见
export function updateSuggest(data) {
  return axios.post(
    `${url}/sys/msSuggest/update.do`, 
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

//删除单个
export function deleteSuggest(id) {
  const data = {
    id: id
  }

  return axios.post(
    `${url}/sys/msSuggest/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// id搜索意见
export function searchSuggestById(id) {
  const data = {
    id: id
  }
  
  return axios.post(
    `${url}/sys/msSuggest/get.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 未读意见数量
export function unreadSuggestList(id) {
  return axios.post(`${url}/sys/msSuggest/count.do`).then(res => {
      return Promise.resolve(res.data)
  })
}