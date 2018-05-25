import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getDepartmentList(data) {
    return axios.post(`${url}/sys/msBranchStruct/listTree.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//添加和更新部门列表
export function addAndUpdateDepartment(data) {
    return axios.post(`${url}/sys/msBranchStruct/saveTree.do`, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}