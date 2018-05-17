import axios from 'axios'
import qs from 'qs'

const commonHeader = 'http://zhsq.digitalcq.com'
export function login() {
	const url = commonHeader + '/monitor/sys/sysuser/login.do'
	const data = {
		userName: 'admin',
		password: '123456',
		role: 1
	}
	return axios.post(url, qs.stringify(data))
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function getDetail(code) {
	const url = commonHeader + '/monitor/sys/systemMonitor/countSuccessRate.do'

	const data = {
		systemCode: code
	}

	return axios.post(url, qs.stringify(data))
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function getType() {
	const url = commonHeader + '/monitor/sys/systemMonitorType/getType.do'

	return axios.post(url, {})
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function getRun() {
	const url = commonHeader + '/monitor/sys/systemMonitor/run.do'
	return axios.get(url, {})
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function getList(page, type, sortType) {
	let myPage = page || 1
	let myType = type || 'id'
	let mySortType = sortType || 'DESC'
	const url = commonHeader + '/monitor/sys/systemMonitor/getList.do'
	const data = {
		page: myPage,
		start: 10 * (myPage - 1),
		limit: 10,
		sort: JSON.stringify([{'property': myType, 'direction': mySortType}])
	}
	return axios.post(url, qs.stringify(data, {indices: false}))
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function save(mydata) {
	const url = commonHeader + '/monitor/sys/systemMonitor/save.do'

	const data = mydata

	return axios.post(url, qs.stringify(data, {indices: false}))
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function systemSave(mydata) {
	const url = commonHeader + '/monitor/sys/system/save.do'

	const data = mydata

	return axios.post(url, qs.stringify(data, {indices: false}))
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function deleteMonitor(id) {
	const url = commonHeader + '/monitor/sys/systemMonitor/delete.do'

	const data = {
		ids: [id]
	}

	return axios.post(url, qs.stringify(data, {indices: false}))
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}