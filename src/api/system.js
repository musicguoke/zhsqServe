import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getAreaQx() {
  const data = {
    pageNo: 1,
    pageSize: 50,
    method: 'list'
  }

  return axios.post(`${url}/sys/areaQx/list.do`, qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

export function getDateTree(id) {
  const data = {
    parentid: id || 'G00000000'
  }

  return axios.post(`${url}/sys/msTabDataController/getGroupDataTreeByParentid.do`, qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getMapConfig() {
  return axios.post(`${url}/sys/msMapConfigController/list.do`).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getFeature() {
  return axios.post(`${url}/sys/msCilentAuthorityController/list.do`).then(res => {
    return Promise.resolve(res.data)
  })
}