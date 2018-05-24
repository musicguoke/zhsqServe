import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getAreaCode() {
    const data = {
        method: 'list',
        pageNo: '1',
        pageSize: '50',
    }
    return axios.post(`${url}//sys/areaQx/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getUserList(data) {
    return axios.post(`${url}//sys/msMembers/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addUser(data) {
    return axios.post(`${url}//sys/msMembers/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateUser(data) {
    return axios.post(`${url}//sys/msMembers/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteUser(data) {
    return axios.post(`${url}//sys/msMembers/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}