import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true
    //参数配置
export function getParameterList(data) {
    return axios.post(`${url}/sys/msMetaController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addParameter(data) {
    return axios.post(`${url}/sys/msMetaController/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateParameter(data) {
    return axios.post(`${url}/sys/msMetaController/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteParameter(data) {
    return axios.post(`${url}/sys/msMetaController/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteParameters(data) {
    return axios.post(`${url}/sys/msMetaController/deletes.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}