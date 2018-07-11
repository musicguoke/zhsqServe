import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true
    // 综合周边
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
export function importHotspot(data) {
    return axios.post(`${url}/sys/hotAround/importFile.do`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
// 规划周边
export function getHotSpotBase(data) {
    return axios.post(`${url}/sys/msHotAroundBase/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addHotSpotBase(data) {
    return axios.post(`${url}/sys/msHotAroundBase/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateHotSpotBase(data) {
    return axios.post(`${url}/sys/msHotAroundBase/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteHotSpotBase(data) {
    return axios.post(`${url}/sys/msHotAroundBase/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function importHotSpotBase(data) {
    return axios.post(`${url}/sys/msHotAroundBase/importFile.do`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
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
export function importHotSearch(data) {
    return axios.post(`${url}/sys/hotSearch/importFile.do`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//词库
export function getLexicon(data) {
    return axios.post(`${url}/sys/msWordLibraryController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addLexicon(data) {
    return axios.post(`${url}/sys/msWordLibraryController/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateLexicon(data) {
    return axios.post(`${url}/sys/msWordLibraryController/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteLexicon(data) {
    return axios.post(`${url}/sys/msWordLibraryController/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteLexicons(data) {
    return axios.post(`${url}/sys/msWordLibraryController/deletes.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function importLexicon(data) {
    return axios.post(`${url}/sys/msWordLibraryController/importFile.do`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
        return Promise.resolve(res.data)
    })
}