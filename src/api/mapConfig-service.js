import axios from '@/util/http'
import qs from 'qs'
//通用参数
const commonParams = {
    os: 'pc'
}
const url = 'http://zhsq.digitalcq.com/cqzhsqd2c_v2/api_v7.do'
axios.defaults.withCredentials = true

//获取底图路径
export function getNewMapConfig() {
    const data = Object.assign({}, commonParams, {
        method: 'getNewMapConfig'
    })
    return axios.post(url, qs.stringify(data)).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取地图的json文件
export function getNewMapJson(url) {
    return axios.get(url, { withCredentials: false }).then(res => {
        return Promise.resolve(res.data)
    })
}