import axios from './'


export const get = (url: string, params?: any) => {
	return axios.get(url, params)
}
export const post = (url: string, params?: any, data?: object) => {
	return axios.post(url, params, data)
}
export const del = (url: string, params?: any) => {
	return axios.delete(url, params)
}