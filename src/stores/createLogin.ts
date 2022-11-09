import { defineStore } from 'pinia'
import { get, post } from '~/api/api'
import { router } from '~/modules/router'
const loading = createLoading()

export default defineStore('login', {
	state() {
		return {
			//变量
			form: {
				name: '',
				password: '',
				captcha: '',
			},
			captchaImg: '',
		}
	},
	actions: {
		async login() {
			loading.loading = true
			const res: any = await post('/admin/login', this.form)
			console.log(res, '登录')
			localStorage.setItem('token', res.data.access_token)
			loading.loading = false
			ElMessage({
				message: '登录成功',
				type: 'success',
			})
			this.form = { name: '', password: '', captcha: '' }
			router.push('/')
		},
		getCaptcha() {
			this.captchaImg =
				'http://marsspace.eqask.com/admin/getCaptcha?' + new Date()
		},
	},
	persist: false, //是否储存在localStorage
})
