import { defineStore } from 'pinia'
import { get, post, del } from '~/api/api'
export default defineStore('PClass', {
	state() {
		return {
			productionTotList: <any>[],
			productionClassList: <any>[],
			productionBrandList: <any>[],
			search: <string>'',
			searchDetail: <string>'',
			dialogFormVisible: <boolean>false,
			dialogFormVisibleDetail: <boolean>false,
			selectPid: 0,
			form: reactive({
				id: 0,
				name: '',
			}),
			settingForm: reactive({
				name: '',
			}),
			isAdd: <boolean>false, // ture 是添加
			isClass: <boolean>false, // ture 是添加分类
			settingBrandName: '',
			dialogImageUrl: ref(''),
			dialogVisible: ref(false),
			disabled: ref(false),
			fileList: <any>[],
			settingItem: <any>{},
		}
	},
	actions: {
		async refshBrand(id?: any) {
			// console.log(id)
			this.productionTotList = []
			this.productionClassList = []
			this.productionBrandList = []
			await this.getPclassList()
			if (id) {
				let res: any = []
				this.productionTotList.forEach((i: any) => {
					if (i.id == id) {
						res = i.data
					}
				})
				this.productionBrandList = res ? res : []
				// console.log(this.productionBrandList, '子品牌类型')
			}
		},
		// 获取产品类型列表页
		async getPclassList() {
			const loading = createLoading()
			loading.loading = true
			const res: any = await get('/admin/product/types/list')
			// console.log(res)
			this.productionClassList = res.data.filter((i: any) => {
				if (i.pid === 0) {
					return i
				}
			})
			this.productionClassList.forEach((element: any) => {
				this.productionTotList.push({
					id: element.id,
					pid: element.id,
					name: element.title,
					data: res.data.filter((i: any) => {
						if (i.pid === element.id) {
							return i
						}
					}),
				})
			})
			// console.log(this.productionClassList, '产品类型')
			// console.log(this.productionTotList, '产品总')
			loading.loading = false
		},
		// 删除产品类型
		deleteRow(item: any) {
			const loading = createLoading()
			// console.log(item)
			ElMessageBox.confirm('确定是否要删除（' + item.title + '）？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					loading.loading = true
					const res: any = await del('/admin/product/types/del/' + item.id)
					// console.log(res)
					this.refshBrand(item.pid)
					loading.loading = false
					if (res.msg == '删除成功') {
						ElMessage({ type: 'success', message: '删除成功' })
					}
				})
				.catch(() => {
					ElMessage({ type: 'info', message: '已取消' })
				})
		},
		// 修改产品类型
		async settingRow(item: any, index: number) {
			const loading = createLoading()
			index == 0 ? (this.isClass = true) : (this.isClass = false)
			this.settingItem = item
			this.isAdd = false
			this.dialogFormVisible = true
			this.settingForm.name = item.title
			// console.log(item)
			// console.log(this.form.id, 'id')
			loading.loading1 = true
			const res: any = await get('/admin/product/types/show/' + item.id)
			// console.log(res)
			this.form.name = res.data.title
			if (res.data.img_url) this.fileList = [{ url: res.data.img_url }]
			loading.loading1 = false
		},
		// 点击产品类型去品牌类型
		settingBrand(item: any) {
			// console.log(item)
			this.form.id = item.id
			this.settingItem = item
			console.log(this.settingItem)
			this.selectPid = item.id
			// console.log(item.pid, 'item.pid')
			this.settingBrandName = item.title
			let res: any = []
			this.productionTotList.forEach((i: any) => {
				if (i.id == item.id) {
					res = i.data
				}
			})
			this.productionBrandList = res ? res : []
			// console.log(this.productionBrandList, '子品牌类型')
			this.dialogFormVisibleDetail = true
			// console.log(this.form, 'this.form')
		},
		// 点击添加
		onAddItem(item: any) {
			item == 0 ? (this.isClass = true) : (this.isClass = false)
			this.isAdd = true
			this.dialogFormVisible = true
			// console.log(item, '添加')
		},
		resetForm() {
			this.dialogFormVisible = false
			this.form.name = ''
			this.form.id = 0
			this.settingForm.name = ''
			this.fileList = []
			this.settingItem = {}
		},
		// 确认关闭产品
		handleClose(done: () => void) {
			ElMessageBox.confirm('确定要取消吗？', '警告', {
				type: 'warning',
			})
				.then(() => {
					this.resetForm()
					done()
				})
				.catch(() => {
					// catch error
				})
		},
		// 确认关闭品牌类型
		handleCloseDetail() {
			this.dialogFormVisibleDetail = false
			this.searchDetail = ''
			this.productionBrandList = []
		},
		// 提交添加
		async createProduct() {
			const loading = createLoading()
			loading.loading2 = true
			console.log(this.settingItem, 'this.settingItem')
			console.log(this.form, 'this.settingItem')
			const params = {
				title: this.form.name,
				pid: this.form.id,
			}
			let data: any = new FormData()
			this.fileList[0]?.raw
				? data.append('img_url', this.fileList[0]?.raw)
				: (data = undefined)
			// // console.log(data)
			const res = await post('/admin/product/types/create', params, data)
			// // console.log(res)
			loading.loading2 = false
			this.dialogFormVisible = false
			this.refshBrand(this.form.id)
			this.fileList = []
			this.form.name = ''
		},
		// 提交修改
		async updateProduct() {
			const loading = createLoading()
			loading.loading2 = true
			const params = {
				title: this.form.name,
				pid: this.settingItem.pid,
			}
			let data: any = new FormData()
			this.fileList[0]?.raw
				? data.append('img_url', this.fileList[0]?.raw)
				: (data = undefined)
			// console.log(data)
			const res = await post(
				'/admin/product/types/update/' + this.settingItem.id,
				params,
				data
			)
			// console.log(res)
			loading.loading2 = false
			this.dialogFormVisible = false
			this.refshBrand(this.settingItem.pid)
			this.fileList = []
			this.form.name = ''
		},
	},
	persist: false, //是否储存在localStorage
})
