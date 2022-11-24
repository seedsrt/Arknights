import axios from './'

export const get = (url: string, params?: any) => {
	return axios({
		method: 'GET',
		url: url,
		params: params,
	})
}
export const post = (url: string, params?: any, data?: object) => {
	return axios({
		method: 'POST',
		url: url,
		params: params,
		data: data,
	})
}
export const del = (url: string, params?: any) => {
	return axios({
		method: 'DELETE',
		url: url,
		params: params,
	})
}
