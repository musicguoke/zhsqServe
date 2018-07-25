import axios from "@/util/http";
import qs from "qs";
import { url } from "./config.js";

axios.defaults.withCredentials = true;

// 获取用户权限列表
export function getAuthorityList(page, type) {
  const data = {
    permissionType: type,
    pageNo: page || 1,
    pageSize: 10
  };

  return axios
    .post(`${url}/sys/msCilentAuthorityController/list.do`, qs.stringify(data))
    .then(res => {
      return Promise.resolve(res.data);
    });
}

// 添加用户权限
export function addAuthority(data) {
  return axios
    .post(
      `${url}/sys/msCilentAuthorityController/insert.do`,
      qs.stringify(data)
    )
    .then(res => {
      return Promise.resolve(res.data);
    });
}

// 编辑用户权限
export function updateAuthority(data) {
  return axios
    .post(
      `${url}/sys/msCilentAuthorityController/update.do`,
      qs.stringify(data)
    )
    .then(res => {
      return Promise.resolve(res.data);
    });
}

// 根据编号获取
export function getAuthority(id) {
  const data = {
    id: id
  };
  return axios
    .post(
      `${url}/sys/msCilentAuthorityController/getMsMapConfig.do`,
      qs.stringify(data)
    )
    .then(res => {
      return Promise.resolve(res.data);
    });
}

// 删除统计分析
export function deleteAuthority(id) {
  const data = {
    id: id
  };
  return axios
    .post(
      `${url}/sys/msCilentAuthorityController/delete.do`,
      qs.stringify(data)
    )
    .then(res => {
      return Promise.resolve(res.data);
    });
}

// 批量删除统计分析
export function deleteAuthorities(id) {
  const data = {
    idStr: id
  };
  return axios
    .post(
      `${url}/sys/msCilentAuthorityController/deletes.do`,
      qs.stringify(data)
    )
    .then(res => {
      return Promise.resolve(res.data);
    });
}

// 导入数据
export function importStatisticFile(data) {
  return axios
    .post(`${url}/sys/msStatisticalConfigController/importFile.do`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      return Promise.resolve(res.data);
    });
}
