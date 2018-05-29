import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true
    /***宏观数据***/
export function getMacroData(data) {
    return axios.post(`${url}/sys/macroData/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateMacroData(data) {
    return axios.post(`${url}/sys/macroData/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
/***区域文本***/
export function getAreaText(data) {
    return axios.post(`${url}/sys/areaText/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}

export function addAreaText(data) {
    return axios.post(`${url}/sys/areaText/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateAreaText(data) {
    return axios.post(`${url}/sys/areaText/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteAreaText(data) {
    return axios.post(`${url}/sys/areaText/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
/***地图配置***/
export function getMapConfigure(data) {
    return axios.post(`${url}/sys/msMapConfigController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function insertMapConfigure(data) {
    return axios.post(`${url}/sys/msMapConfigController/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateMapConfigure(data) {
    return axios.post(`${url}/sys/msMapConfigController/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//根据id获取列表
export function getMapConfigureById(data) {
    return axios.post(`${url}/sys/msMapConfigController/getMsMapConfig.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteMapConfigureById(data) {
    return axios.post(`${url}/sys/msMapConfigController/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//批量删除
export function deletesMapConfigureById(data) {
    return axios.post(`${url}/sys/msMapConfigController/deletes.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}