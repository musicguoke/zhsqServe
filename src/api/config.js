// export const url = 'http://192.168.11.82:8070/zhsq_business'
export const url = process.env.NODE_ENV === 'development' ? '/api/zhsq_business' : 'http://zhsq.digitalcq.com/zhsq_business'
// export const url = 'http://172.16.4.134:8080/zhsq_business'

//返回结果状态码
export const ERR_OK = 0