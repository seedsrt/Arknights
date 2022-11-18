import { defineStore } from 'pinia'
import { router } from '~/modules/router'
import { post } from '~/api/api'
export default defineStore('asider', {
	state() {
		return {
			//变量
			isCollapse: false,
			asideActive: '/',
			title: '主页',
			breadcrumb: [],
		}
	},
	actions: {
		menuClick(key: string, keyPath: []) {
			// console.log(keyPath)
			router.push(key)
			router.afterEach((to, from) => {
				// console.log(to)
				if (to.meta.name != 'notFound') {
					this.breadcrumb = keyPath
					this.asideActive = to.path
					const titleName: any = to.meta.name
					this.title = titleName
					// console.log(to.path)
				} else {
					this.asideActive = '/'
					this.title = '主页'
				}
			})
		},
		async loginOut() {
			const res = await post('/admin/logout')
			console.log(res)
			if (res?.code === 200) {
				ElMessage({
					message: '退出成功',
					type: 'success',
				})
				localStorage.setItem('token', '')
				router.push('/login')
			}
		},
	},
	persist: true, //是否储存在localStorage
})
