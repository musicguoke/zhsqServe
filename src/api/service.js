import axios from "@/util/http"
import qs from "qs"
import { url } from "./config.js"

axios.defaults.withCredentials = true

export function login(loginInfo) {
  return axios
    .post(`${url}/sys/sysUser/login.do`, qs.stringify(loginInfo))
    .then(res => {
      return Promise.resolve(res.data);
    })
}

export function logout(loginInfo) {
  return axios
    .post(`${url}/sys/sysUser/logout.do`)
    .then(res => {
      return Promise.resolve(res.data);
    })
}

//首页指标
export function getIndex() {
  return axios
    .post(`${url}/sys/msHomepageStatistical/statistics.do`)
    .then(res => {
      return Promise.resolve(res.data);
    })
}

// 首页监控统计
export function getMetaUrl() {
  return axios
    .post(`${url}/sys/msHomepageStatistical/getMetaUrl.do`)
    .then(res => {
      return Promise.resolve(res.data);
    })
}

// 首页图表统计
export function getLogStatistics() {
  return axios
    .post(`${url}/sys/msHomepageStatistical/getLogStatistics.do`)
    .then(res => {
      return Promise.resolve(res.data);
    })
}


export function getMenu(id) {
  const data = {
    typeid: 13
  }

  return axios
    .post(
      `${url}/zhsq_business/sys/msBaseContentTypeController/getMsBaseContentType.do`,
      qs.stringify(data)
    )
    .then(res => {
      return Promise.resolve(res.data);
    })
}
