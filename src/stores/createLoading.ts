import { defineStore } from 'pinia'
import { getGacha } from '~/api/globalApi'
export default defineStore('loading', {
	state() {
		return {
			//变量
		}
	},
	actions: {
		async getData() {
			const res = await getGacha('+vwLUYsFRb98t2nNIGFBn79i')
			console.log(res)
		},
	},
	persist: false, //是否储存在localStorage
})
