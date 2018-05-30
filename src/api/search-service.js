import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true
    // 热点
export function getHotspot(data) {
    return axios.post(`${url}/sys/hotAround/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addHotspot(data) {
    return axios.post(`${url}/sys/hotAround/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateHotspot(data) {
    return axios.post(`${url}/sys/hotAround/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteHotspot(data) {
    return axios.post(`${url}/sys/hotAround/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//热搜
export function getHotSearch(data) {
    return axios.post(`${url}/sys/hotSearch/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}

export function addHotSearch(data) {
    return axios.post(`${url}/sys/hotSearch/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateHotSearch(data) {
    return axios.post(`${url}/sys/hotSearch/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteHotSearch(data) {
    return axios.post(`${url}/sys/hotSearch/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}