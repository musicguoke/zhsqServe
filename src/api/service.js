import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function login(loginInfo) {
  return axios.post(`${url}//sys/sysUser/login.do`, qs.stringify(loginInfo)).then(res => {
    return Promise.resolve(res.data)
})
}

export function getMenu(id) {
  const data = {
    typeid: 13
  }

  return axios.post(`${url}/zhsq_business/sys/msBaseContentTypeController/getMsBaseContentType.do`, qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}
