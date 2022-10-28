import axios from './'

export const get = (url: string, params?: any) => {
	// 返回的数据格式可以和服务端约定
	return axios.get(url, params)
}
export const post = (url: string, params?: any, data?: object) => {
	// 返回的数据格式可以和服务端约定
	return axios.post(url, params, data)
}
export const del = (url: string, params?: any) => {
	// 返回的数据格式可以和服务端约定
	return axios.delete(url, params)
}
