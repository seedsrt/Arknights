/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios'
import { router } from '~/modules/router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
// 第一个代理基础路径配置
//axios.defaults.baseURL = 'https://api.noechou.cn/';
// 环境的切换

axios.defaults.baseURL = import.meta.env['VITE_APP_BASE_API']
/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status: number, other: any) => {
	// 状态码判断
	switch (status) {
		case 600:
			ElMessage.error('未登录，请先登录')
			localStorage.removeItem('token')
			break
		// 403 token过期
		// 清除token并跳转登录页
		case 403:
			ElMessage.error('token已过期')
			localStorage.removeItem('token')
			break
		// 404请求不存在
		case 404:
			ElMessage.error('404，请求不存在')
			router.replace({
				path: '/404',
			})
			break
		default:
			ElMessage.error(other.data.msg)
			console.log(other)
	}
}

// 创建axios实例
var instance = axios.create({
	timeout: 1000 * 12,
})
// 设置post请求头
instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
	(config: any) => {
		// 登录流程控制中，根据本地是否存在token判断用户的登录情况
		// 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
		// 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
		//而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
		// const token = localStorage.getItem('token')
		// token && (config.headers.Authorization = 'Bearer ' + token)
		NProgress.start()
		return config
	},
	(error) => Promise.resolve(error)
)

// 响应拦截器
instance.interceptors.response.use(
	// 请求成功
	(res) => {
		NProgress.done()
		return res.data
	},

	// 请求失败
	(error) => {
		const { response } = error
		NProgress.done()
		if (response) {
			// 请求已发出，但是不在2xx的范围
			errorHandle(response.status, response.data.ElMessage)
			return Promise.reject(response)
		} else {
			// 处理断网的情况
			// eg:请求超时或断网时，更新state的network状态
			// network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
			// 关于断网组件中的刷新重新获取数据，会在断网组件中说明
			if (!window.navigator.onLine) {
				//store.commit('changeNetwork', false);
			} else {
				return Promise.reject(error)
			}
		}
	}
)

export default instance
