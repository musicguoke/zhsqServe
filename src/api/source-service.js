import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

axios.defaults.withCredentials = true

export function getMenu(id) {
  const data = {
    typeid: 13
  }

  return axios.post(`${url}/zhsq_business/sys/msBaseContentTypeController/getMsBaseContentType.do`, qs.stringify(data)).then(res => {
      return Promise.resolve(res.data)
  })
}
