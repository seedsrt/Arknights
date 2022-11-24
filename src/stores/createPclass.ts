import { defineStore } from 'pinia'
import {
	createProductTypes,
	getProductTypesList,
	getProductTypesDetail,
	updateProductTypes,
	deleteProductTypes,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
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
			const res: any = await getProductTypesList()
			// console.log(res)
			if (res?.code == 200) {
				let resData = res.data ? res.data : []
				this.productionClassList = resData.filter((i: any) => {
					if (i.pid === 0) {
						return i
					}
				})
				this.productionClassList.forEach((element: any) => {
					this.productionTotList.push({
						id: element.id,
						pid: element.id,
						name: element.title,
						data: resData.filter((i: any) => {
							if (i.pid === element.id) {
								return i
							}
						}),
					})
				})
			}
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
					const res: any = await deleteProductTypes(item.id)
					// console.log(res)
					this.refshBrand(item.pid)
					loading.loading = false
					if (res?.code == 200) {
						ElMessage({ type: 'success', message: '删除成功' })
					}
				})
				.catch(() => {
					ElMessage({ type: 'info', message: '已取消' })
				})
		},
		// 修改产品类型
		async settingRow(
			formEl: FormInstance | undefined,
			item: any,
			index: number
		) {
			formEl?.clearValidate()
			const loading = createLoading()
			index == 0 ? (this.isClass = true) : (this.isClass = false)
			this.settingItem = item
			this.isAdd = false
			this.dialogFormVisible = true
			this.settingForm.name = item.title
			// console.log(item)
			// console.log(this.form.id, 'id')
			loading.loading1 = true
			const res: any = await getProductTypesDetail(item.id)
			if (res?.code == 200) {
				// console.log(res)
				let resData = res.data ? res.data : {}
				this.form.name = resData.title
				if (resData.img_url) this.fileList = [{ url: resData.img_url }]
			}
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
		onAddItem(formEl: FormInstance | undefined, item: any) {
			formEl?.clearValidate()
			item == 0 ? (this.isClass = true) : (this.isClass = false)
			this.isAdd = true
			this.dialogFormVisible = true
			// console.log(item, '添加')
		},
		resetForm() {
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
					this.dialogFormVisible = false
					this.resetForm()
					done()
				})
				.catch(() => {
					// catch error
				})
		},
		// 确认关闭品牌类型
		handleCloseDetail(formEl: FormInstance | undefined) {
			this.dialogFormVisibleDetail = false
			this.searchDetail = ''
			formEl?.clearValidate()
			this.productionBrandList = []
		},
		// 提交添加
		async createProduct(formEl: FormInstance | undefined) {
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
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
					const res: any = await createProductTypes(params, data)
					console.log(res)
					if (res?.code == 200) {
						this.dialogFormVisible = false
						this.refshBrand(this.form.id)
						this.fileList = []
						this.form.name = ''
					}
					loading.loading2 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
		// 提交修改
		async updateProduct(formEl: FormInstance | undefined) {
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
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
					const res: any = await updateProductTypes(
						this.settingItem.id,
						params,
						data
					)
					if (res?.code == 200) {
						this.dialogFormVisible = false
						this.refshBrand(this.settingItem.pid)
						this.fileList = []
						this.form.name = ''
					}
					// console.log(res)
					loading.loading2 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
	},
	persist: false, //是否储存在localStorage
})
