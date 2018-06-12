import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getAreaCode() {
    const data = {
        method: 'list',
        pageNo: '1',
        pageSize: '60',
    }
    return axios.post(`${url}/sys/msAreaCode/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getUserList(data) {
    return axios.post(`${url}/sys/msMembers/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addUser(data) {
    return axios.post(`${url}/sys/msMembers/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateUser(data) {
    return axios.post(`${url}/sys/msMembers/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteUser(data) {
    return axios.post(`${url}/sys/msMembers/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取人员设备
export function getEquipment(data) {
    return axios.post(`${url}/sys/msMembersInfo/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//修改人员设备
export function updateEquipment(data) {
    return axios.post(`${url}/sys/msMembersInfo/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取用户角色列表
export function getRolesList(sysId) {
    const data = {
        pageNo: 1,
        pageSize: 100,
        method: 'list',
        grName: name || '',
        sysId: sysId
    }

    return axios.post(
        `${url}/sys/msMembersGroup/list.do`,
        qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//根据用户id获取对应的系统和角色
export function getUserSysAndRole(id) {
    const data = {
        arId: id
    }
    return axios.post(`${url}/sys/msSystemMembers/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}