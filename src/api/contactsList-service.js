import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getContactsList(data) {
    return axios.post(`${url}/sys/msSendMessageController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addContacts(data) {
    return axios.post(`${url}/sys/msSendMessageController/insert.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function updateContacts(data) {
    return axios.post(`${url}/sys/msSendMessageController/update.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteContacts(data) {
    return axios.post(`${url}/sys/msSendMessageController/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deletesContacts(data) {
    return axios.post(`${url}/sys/msSendMessageController/deletes.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}