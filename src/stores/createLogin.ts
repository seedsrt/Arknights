import { defineStore } from 'pinia'
import { post } from '~/api/api'
import { router } from '~/modules/router'

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
			const loading = createLoading()
			const aside = createAside()
			loading.loading = true
			const res: any = await post('/admin/login', this.form)
			console.log(res, '登录')
			if (res?.code == 200) {
				localStorage.setItem(
					'token',
					res.data.access_token ? res.data.access_token : ''
				)
				aside.asideActive = '/'
				aside.breadcrumb = []
				aside.isCollapse = false
				aside.title = '主页'
				ElMessage({
					message: '登录成功',
					type: 'success',
				})
				this.form = { name: '', password: '', captcha: '' }
				router.push('/')
			}
			loading.loading = false
		},
		getCaptcha() {
			this.captchaImg =
				'http://marsspace.eqask.com/admin/getCaptcha?' + new Date()
		},
	},
	persist: false, //是否储存在localStorage
})
