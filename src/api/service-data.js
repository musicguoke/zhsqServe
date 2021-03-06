import axios from '@/util/http'
import qs from 'qs'
import { url } from './config.js'

// const commonHeader = process.env.NODE_ENV === 'production' ? 'http://zhsq.digitalcq.com/cqzhsqd2c_v2' : '/api/cqzhsqd2c_v2'
const commonHeader = url

export function dayData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getBranchCountByDay.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function dateData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getBranchCountByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function dayLogData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getBranchDataByDay.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function dateLogData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getBranchDataByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function dayUserLogData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getUserDataByDay.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function dayQxLogData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getAreaNameByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

//行政区划的用户统计
export function qxUserLogData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getUserByAreacode.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function dateUserLogData(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getDataByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function getDataCount(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getDataCountByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function filterCommon(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getUserGroupConditionByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function getSysGroup(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getSysGroupByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

export function getSoftGroup(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getSoftGroupByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

//用户搜索
export function getUserGroupSearchByDate(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getUserGroupSearchByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

//部门搜索
export function getBranchSearchByDate(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getBranchSearchByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

//数据搜索
export function getDataSearchCountByDate(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getDataSearchCountByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

//搜索关键词统计
export function getWordCountByDate(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getWordCountByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

//搜索关键词搜索查询
export function getWordSearchCountByDate(data) {

	let params = ''

	for(let key in data) {
		params += `${key}=${data[key]}&`
	}
	params = params.substring(0, params.length - 1)
	const url = commonHeader + `/sys/EslogStatistics/getWordSearchCountByDate.do?${params}`

	return axios.get(url)
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}

//登录
export function login(data) {

	const url = commonHeader + `/sys/sysuser/login.do`

	return axios.post(url, qs.stringify(data))
  	.then(function (res) {
    	return Promise.resolve(res.data)
  	})
}