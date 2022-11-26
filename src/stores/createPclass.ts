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
			form: reactive({
				id: 0,
				name: '',
			}),
			settingForm: reactive({
				name: '',
			}),
			isAdd: <boolean>false, // ture 是否添加
			isClass: <boolean>false, // ture 是否添加分类
			settingBrandName: '',
			dialogImageUrl: ref(''),
			dialogVisible: ref(false),
			disabled: ref(false),
			fileList: <any>[],
			settingItem: <any>{},
			settingItemSecond: <any>{},
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
					loading.loading = false
					if (res?.code == 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.refshBrand(this.settingItemSecond.id)
					}
				})
				.catch(() => {
					ElMessage({ type: 'info', message: '已取消' })
				})
		},

		// 点击修改按钮
		async settingRow(
			formEl: FormInstance | undefined,
			item: any,
			isClass: boolean
		) {
			formEl?.clearValidate()
			this.isClass = isClass
			this.settingItem = item
			this.settingItemSecond = item
			this.isAdd = false
			this.dialogFormVisible = true
			this.settingForm.name = item.title
			console.log(this.settingItem, 'settingItem')
			this.form.name = item.title
			if (item.img_url) this.fileList = [{ url: item.img_url }]
		},

		// 点击添加按钮
		addProductionClass(formEl: FormInstance | undefined, isFirst: boolean) {
			formEl?.clearValidate()
			this.isClass = isFirst
			this.isAdd = true
			this.dialogFormVisible = true
		},

		// 点击产品类型去品牌类型
		settingBrand(item: any) {
			// console.log(item)
			this.form.id = item.id
			this.settingItem = item
			this.settingItemSecond = item
			console.log(this.settingItem, 'settingItem')
			this.settingBrandName = item.title
			let res: any = []
			this.productionTotList.forEach((i: any) => {
				if (i.id == item.id) {
					res = i.data
				}
			})
			this.productionBrandList = res ? res : []
			console.log(this.productionBrandList, '子品牌类型')
			this.dialogFormVisibleDetail = true
		},

		resetForm() {
			this.form.name = ''
			this.form.id = 0
			this.fileList = []
			this.settingItem = {}
			this.isClass ? (this.settingItemSecond = {}) : ''
		},

		// 确认关闭产品二级分类
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

		// 确认关闭产品一级分类
		handleCloseDetail() {
			this.dialogFormVisibleDetail = false
			this.searchDetail = ''
			this.productionBrandList = []
		},

		// 提交添加和修改产品二级分类
		async sumProductClass(formEl: FormInstance | undefined) {
			if (!formEl) return
			await formEl.validate(async (valid: any) => {
				if (valid) {
					const loading = createLoading()
					loading.loading2 = true
					const params = {
						title: this.form.name,
						pid: this.isAdd
							? this.isClass
								? 0
								: this.settingItemSecond.id == this.settingItem?.id
								? this.settingItemSecond.id
								: this.settingItemSecond.pid
							: this.isClass
							? 0
							: this.settingItemSecond.pid,
					}
					let data: any = new FormData()
					this.fileList[0]?.raw
						? data.append('img_url', this.fileList[0]?.raw)
						: (data = undefined)
					// this.isAdd
					// 	? console.log(params, 'params')
					// 	: console.log(params, this.settingItem.id, 'params')
					const res: any = this.isAdd
						? await createProductTypes(params, data)
						: await updateProductTypes(this.settingItem.id, params, data)
					console.log(res)
					if (res?.code == 200) {
						ElMessage.success('修改成功')
						await this.refshBrand(this.settingItemSecond.id)
						this.dialogFormVisible = false
						this.resetForm()
					}
					loading.loading2 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
	},
	persist: false, //是否储存在localStorage
})
