import axios from '@/util/http'
import qs from 'qs'
const url = 'http://zhsq.digitalcq.com/monitor'
axios.defaults.withCredentials = true
    // 服务监控
export function getSeverMonitorList() {
    return axios.post(`${url}/sys/systemMonitor/countSuccessRate.do`, qs.stringify()).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addSeverMonitor(data) {
    return axios.post(`${url}/sys/system/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getSeverMonitorDetail(data) {
    return axios.post(`${url}/sys/systemMonitor/getList.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function addSeverMonitorDetail(data) {
    return axios.post(`${url}/sys/systemMonitor/save.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
export function deleteSeverMonitorDetail(data) {
    return axios.post(`${url}/sys/systemMonitor/delete.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}