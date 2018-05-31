import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true
    /***
     * 推送
     * ***/
export function getPushList(data) {
    return axios.post(`${url}/sys/msPushController/list.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}