import { defineStore } from 'pinia'
import { router } from '~/modules/router'
import { get, post } from '~/api/api'
const loading = createLoading()
export default defineStore('PClass', {
	state() {
		return {
			productionClassList: <any>[],
		}
	},
	actions: {
		async getPclassList() {
			loading.loading = true
			const res: any = await get('/admin/product/types/list')
			console.log(res)
			this.productionClassList = res.data
			for (let i = 0; i < 10; i++) {
				this.productionClassList.push(res.data[0])
			}
			loading.loading = false
		},
	},
	persist: false, //是否储存在localStorage
})
