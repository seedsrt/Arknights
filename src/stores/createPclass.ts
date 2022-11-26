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
			settingBrandName: '',
			searchDetail: <string>'',
			dialogFormVisible1: <boolean>false, // 一级表单显隐藏
			dialogFormVisible2: <boolean>false, // 二级表单显隐藏
			dialogFormVisibleDetail: <boolean>false, // 点击表格进去显隐
			// 一级
			form1: reactive({
				name: '',
			}),
			// 二级
			form2: reactive({
				name: '',
			}),
			gotoItem: <any>{}, // 点击产品一级点击去品牌二级
			settingItem1: <any>{}, // 一级表单点击修改
			settingItem2: <any>{}, // 二级表单点击修改
			isAdd1: <boolean>false, // ture 一级是否添加
			isAdd2: <boolean>false, // ture 二级是否添加
			dialogImageUrl: ref(''),
			dialogVisible: ref(false),
			disabled: ref(false),
			fileList: <any>[],
		}
	},
	actions: {
		async refshBrand(pid?: any) {
			console.log(pid)
			this.productionTotList = []
			this.productionClassList = []
			this.productionBrandList = []
			await this.getPclassList()
			if (pid) {
				let res: any = []
				this.productionTotList.forEach((i: any) => {
					if (i.id == pid) {
						res = i.data
					}
				})
				this.productionBrandList = res ? res : []
			}
			console.log(this.productionBrandList, 'this.productionBrandList')
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
						pid: element.pid,
						name: element.title,
						data: resData.filter((i: any) => {
							if (i.pid === element.id) {
								return i
							}
						}),
					})
				})
			}
			console.log(this.productionClassList, '产品类型')
			console.log(this.productionTotList, '产品总')
			loading.loading = false
		},

		// 点击添加和修改 产品一级
		settingProductionClass(
			formEl: FormInstance | undefined,
			isAdd: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			this.isAdd1 = isAdd
			if (item) {
				this.form1.name = item.title
				this.settingItem1 = item
			} else {
				this.form1.name = ''
				this.settingItem1 = {}
			}
			this.dialogFormVisible1 = true
		},

		// 点击添加和修改 品牌二级
		settingProduction(
			formEl: FormInstance | undefined,
			isAdd: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			this.isAdd2 = isAdd
			if (item) {
				console.log(item)
				this.form2.name = item.title
				this.settingItem2 = item
				console.log(this.settingItem2)
			} else {
				this.form2.name = ''
				this.settingItem2 = {}
			}
			this.dialogFormVisible2 = true
		},

		// 点击删除 产品一级
		deleteProductionClass(item: any) {
			console.log(item)
			const loading = createLoading()
			ElMessageBox.confirm('确定是否要删除（' + item.title + '）？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					loading.loading = true
					const res: any = await deleteProductTypes(item.id)
					if (res?.code == 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getPclassList()
					}
					loading.loading = false
				})
				.catch(() => {
					ElMessage({ type: 'info', message: '已取消' })
				})
		},

		// 点击删除 品牌二级
		deleteProduction(item: any) {
			console.log(item)
			const loading = createLoading()
			ElMessageBox.confirm('确定是否要删除（' + item.title + '）？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					loading.loading1 = true
					const res: any = await deleteProductTypes(item.id)
					if (res?.code == 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.refshBrand(item.pid)
					}
					loading.loading1 = false
				})
				.catch(() => {
					ElMessage({ type: 'info', message: '已取消' })
				})
		},

		// 点击产品类型去品牌类型
		settingBrand(item: any) {
			this.settingBrandName = item.title
			this.gotoItem = item
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

		// 确认关闭产品一级分类
		handleClose1(done: () => void) {
			ElMessageBox.confirm('确定要取消吗？', '警告', {
				type: 'warning',
			})
				.then(() => {
					this.dialogFormVisible1 = false
					done()
				})
				.catch(() => {
					// catch error
				})
		},

		// 确认关闭品牌二级分类
		handleClose2(done: () => void) {
			ElMessageBox.confirm('确定要取消吗？', '警告', {
				type: 'warning',
			})
				.then(() => {
					this.dialogFormVisible2 = false
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

		// 提交添加和修改产品一级分类
		async sumProductionClass(formEl: FormInstance | undefined) {
			if (!formEl) return
			await formEl.validate(async (valid: any) => {
				if (valid) {
					const loading = createLoading()
					loading.loading2 = true
					const params = {
						title: this.form1.name,
						pid: 0,
					}
					const res: any = this.isAdd1
						? await createProductTypes(params)
						: await updateProductTypes(this.settingItem1.id, params)
					console.log(res)
					if (res?.code == 200) {
						this.isAdd1
							? ElMessage.success('添加成功')
							: ElMessage.success('修改成功')
						await this.getPclassList()
						this.dialogFormVisible1 = false
					}
					loading.loading2 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},

		// 提交添加和修改品牌二级分类
		async sumProduction(formEl: FormInstance | undefined) {
			if (!formEl) return
			await formEl.validate(async (valid: any) => {
				if (valid) {
					const loading = createLoading()
					loading.loading2 = true
					const params = {
						title: this.form2.name,
						pid: this.settingItem2.pid
							? this.settingItem2.pid
							: this.gotoItem.id,
					}
					let data: any = new FormData()
					this.fileList[0]?.raw
						? data.append('img_url', this.fileList[0]?.raw)
						: (data = undefined)
					const res: any = this.isAdd2
						? await createProductTypes(params, data)
						: await updateProductTypes(this.settingItem2.id, params, data)
					console.log(res)
					if (res?.code == 200) {
						this.isAdd2
							? ElMessage.success('添加成功')
							: ElMessage.success('修改成功')
						await this.refshBrand(
							this.settingItem2.pid ? this.settingItem2.pid : this.gotoItem.id
						)
						this.dialogFormVisible2 = false
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
