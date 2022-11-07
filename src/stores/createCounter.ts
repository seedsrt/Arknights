import { defineStore } from 'pinia'
import { get } from '~/api/api'
export default defineStore('counter', {
	state() {
		return {
			//变量
			count: 0,
			dataList: ref([]),
			loading: ref(false),
			form: ref({
				offset: '1',
				limit: '10',
				order: 'asc',
			}),
		}
	},
	actions: {
		inc() {
			//自定义方法
			this.count++
		},
		async getData() {
			this.loading = true
			const res: any = await get('/library/books/list', this.form)
			console.log(res)
			this.dataList = res.data
			this.loading = false
		},
	},
	persist: false, //是否储存在localStorage
})
