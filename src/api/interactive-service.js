import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true
    //推送
export function getPushList(data) {
    return axios.post(`${url}//sys/msPushController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addPushList(data) {
    return axios.post(`${url}//sys/msPushController/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deletePush(data) {
    return axios.post(`${url}//sys/msPushController/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//短信
export function getMessageList(data) {
    return axios.post(`${url}//sys/msSendMessageController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addContacts(data) {
    return axios.post(`${url}//sys/msSendMessageController/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateContacts(data) {
    return axios.post(`${url}//sys/msSendMessageController/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteContacts(data) {
    return axios.post(`${url}//sys/msSendMessageController/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function sendMessage(data) {
    return axios.post(`${url}//sys/msSendMessageController/send.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}