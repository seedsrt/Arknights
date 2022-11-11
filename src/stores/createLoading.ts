import { defineStore } from 'pinia'
import { nextTick } from 'vue'
export default defineStore('loading', {
	state() {
		return {
			//变量
			loading: false,
			loading1: false,
			loading2: false,
			loading3: false,
			isReloading: true,
		}
	},
	actions: {
		getDDD() {
			console.log(this.loading)
		},
		reloadPart() {
			this.isReloading = false
			nextTick(() => {
				this.isReloading = true
			})
		},
	},
	persist: false, //是否储存在localStorage
})
