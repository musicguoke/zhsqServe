import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

// 角色管理
export function getRolesList(name, page) {
  const data = {
    pageNo: page || 1,
    pageSize: 10,
    method: 'list', 
    grName: name
  }

  return axios.post(
    `${url}/sys/msMembersGroup/list.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 添加角色
export function addRole(data) {

  return axios.post(
    `${url}/sys/msMembersGroup/insertRoleS.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 更新角色
export function updateRole(data) {
  return axios.post(
    `${url}/sys/msMembersGroup/updateRoleS.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 删除角色
export function deleteRole(id) {
  const data = {
    method: 'delete',
    grId: id
  }

  return axios.post(
    `${url}/sys/msMembersGroup/delete.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 根据编号获取角色及角色数据功能地图
export function getRoleMapById(id) {
  const data = {
    grId: id
  }

  return axios.post(
    `${url}/sys/msMembersGroup/get.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 修改角色及权限功能地图
export function updateRoleMap() {
  return axios.post(
    `${url}/sys/msMembersGroup/updateRoleS.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}

// 角色打包
export function getRoleModuleById(id) {
  const data = {
    grId: id
  }

  return axios.post(
    `${url}/sys/msMembersGroup/index.do`,
    qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}