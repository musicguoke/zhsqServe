import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true
    //推送
export function getPushList(data) {
    return axios.post(`${url}/sys/msPushController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addPushList(data) {
    return axios.post(`${url}/sys/msPushController/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deletePush(data) {
    return axios.post(`${url}/sys/msPushController/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deletePushs(data) {
    return axios.post(`${url}/sys/msPushController/deletes.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//短信
export function getMessageList(data) {
    return axios.post(`${url}/sys/msSendMessageController/messagelist.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function sendMessage(data) {
    return axios.post(`${url}/sys/msSendMessageController/send.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getMessageById(data) {
    return axios.post(`${url}/sys/msSendMessageController/getMessage.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//技术支持
export function getTechnicalSupportList(data) {
    return axios.post(`${url}/sys/msCompanyInfo/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addTechnicalSupport(data) {
    return axios.post(`${url}/sys/msCompanyInfo/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateTechnicalSupport(data) {
    return axios.post(`${url}/sys/msCompanyInfo/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteTechnicalSupport(data) {
    return axios.post(`${url}/sys/msCompanyInfo/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteTechnicalSupports(data) {
    return axios.post(`${url}/sys/msCompanyInfo/deletes.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}