import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getManagerList(data) {
    return axios.post(`${url}/sys/sysUser/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addManager(data) {
    return axios.post(`${url}/sys/sysUser/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getManagerById(id) {
    const data = {
        id: id
    }
    return axios.post(`${url}/sys/sysUser/get.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateManager(data) {
    return axios.post(`${url}/sys/sysUser/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteManager(data) {
    return axios.post(`${url}/sys/sysUser/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}