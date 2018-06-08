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
export function importAreaText(data) {
    return axios.post(`${url}/sys/areaText/importFile.do`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
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
/**数据指标**/
export function getDataTarget(data) {
    return axios.post(`${url}/sys/dataTarget/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateDataTarget(data) {
    return axios.post(`${url}/sys/dataTarget/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteDataTarget(data) {
    return axios.post(`${url}/sys/dataTarget/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
/**区域指标**/
export function getAreaTarget(data) {
    return axios.post(`${url}/sys/msAreaTarget/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addAreaTarget(data) {
    return axios.post(`${url}/sys/msAreaTarget/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateAreaTarget(data) {
    return axios.post(`${url}/sys/msAreaTarget/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteAreaTarget(data) {
    return axios.post(`${url}/sys/msAreaTarget/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
/**专题类型**/
export function getSTopicTypeList(data) {
    return axios.post(`${url}/sys/MsDataPublishType/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addSTopicType(data) {
    return axios.post(`${url}/sys/MsDataPublishType/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function uspdateSTopicType(data) {
    return axios.post(`${url}/sys/MsDataPublishType/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteSTopicType(data) {
    return axios.post(`${url}/sys/MsDataPublishType/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
/**720资源**/
export function get720Resource(data) {
    return axios.post(`${url}/sys/720Server/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function add720Resource(data) {
    return axios.post(`${url}/sys/720Server/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function update720Resource(data) {
    return axios.post(`${url}/sys/720Server/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function delete720Resource(data) {
    return axios.post(`${url}/sys/720Server/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
/**图片资源**/
export function getImageSource(data) {
    return axios.post(`${url}/sys/imageSource/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addImageSource(data) {
    return axios.post(`${url}/sys/imageSource/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateImageSource(data) {
    return axios.post(`${url}/sys/imageSource/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteImageSource(data) {
    return axios.post(`${url}/sys/imageSource/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}