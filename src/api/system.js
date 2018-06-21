import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getBuildConfig() {
  const data = {
    pageNo: 1,
    pageSize: 50
  }

  return axios.post(`${url}/sys/msSystemChildController/index.do`, qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

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
    parentid: id || -1
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

export function getFeature(id) {
  const data = {
    id: id || ''
  }
  return axios.post(
    `${url}/sys/msCilentAuthorityController/list.do`,
    qs.stringify(data)
    ).then(res => {
    return Promise.resolve(res.data)
  })
}

//系统列表
export function getSystemList(page, sysName) {
  const data = {
    page: page || 1,
    sysName: sysName
  }

  return axios.post(`${url}/sys/msSystemChildController/list.do`, qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

// 进入系统
export function enterSystem(id) {
  const data = {
    sysId: id || ''
  }

  return axios.post(`${url}/sys/sysUser/selectSysId.do`, qs.stringify(data)).then(res => {
    return Promise.resolve(res.data)
  })
}

//添加系统
export function addSystem(data) {
  return axios.post(
    `${url}/sys/msSystemChildController/insert.do`,
    qs.stringify({jsonStr: data})).then(res => {
      return Promise.resolve(res.data)
  })
}

//修改系统
export function updateSystem(data) {
  return axios.post(
    `${url}/sys/msSystemChildController/update.do`, 
    qs.stringify({jsonStr: data})).then(res => {
      return Promise.resolve(res.data)
  })
}

//删除单个
export function deleteSingleSystem(id) {
  const data = {
    id: id
  }

  return axios.post(
    `${url}/sys/msSystemChildController/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

//删除批量
export function deleteBatchSystems(id) {
  const data = {
    idStr: id
  }
  
  return axios.post(
    `${url}/sys/msSystemChildController/deletes.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// id搜索系统
export function searchSysById(id) {
  const data = {
    id: id
  }
  
  return axios.post(
    `${url}/sys/msSystemChildController/getMsSystemChildById.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}