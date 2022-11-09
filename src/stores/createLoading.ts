import { defineStore } from 'pinia'
import { nextTick } from 'vue'
export default defineStore('loading', {
	state() {
		return {
			//变量
			loading: false,
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
