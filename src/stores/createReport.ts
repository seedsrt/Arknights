import { defineStore } from 'pinia'
import { getReportList } from '~/api/globalApi'
export default defineStore('Report', {
	state() {
		return {
			// 获取用户报告列表参数
			params: <any>{
				offset: 1,
				limit: 10,
				order: 'desc',
			},
			// 用户报告列表总数
			total: 0,
			dialogFormVisible: false,
			// 报告列表
			reportList: <any>[],
			// 搜索内容
			search: '',
			// 点击表格详情数据
			details: <any>{},
			timer: <any>'',
		}
	},
	actions: {
		// 搜索
		searchDetail() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(async () => {
				const loading = createLoading()
				this.reportList = []
				loading.loading2 = true
				const res: any = await getReportList({
					...this.params,
					title: this.search,
				})
				console.log(res)
				if (res?.code == 200) {
					this.reportList = res.data.data ? res.data.data : []
					this.total = res.data.total
				}
				loading.loading2 = false
			}, 600)
		},
		//获取用户报告列表
		async getUserList() {
			const loading = createLoading()
			loading.loading = true
			this.reportList = []
			const { data } = await getReportList(this.params)
			console.log(data, '获取用户列表')
			this.reportList = data ? data?.data : []
			this.total = data ? data.total : 0
			loading.loading = false
		},
		// 点击进去详情
		gotoDetails(item: any) {
			console.log(item)
			this.dialogFormVisible = true
			this.details = item
		},
		handleSizeChange(val: number) {
			this.params.offset = 1
			this.params.limit = val
			this.getUserList()
			console.log(`${val} 更换每页条数`)
		},
		handleCurrentChange(val: number) {
			this.params.offset = val
			this.getUserList()
			console.log(`${val} 更换当前页数`)
		},
	},
	persist: false, //是否储存在localStorage
})
