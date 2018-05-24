import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getHotspot(data) {
    return axios.post(`${url}/sys/hotAround/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getHotSearch(data) {
    return axios.post(`${url}/sys/hotSearch/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}