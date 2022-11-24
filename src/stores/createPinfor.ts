import { defineStore } from 'pinia'
import {
	createProduction,
	getProductionList,
	getProductTypesList,
	getProductionDetail,
	updateProduction,
	deleteProduction,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('PInfor', {
	state() {
		return {
			isShowAdd: false,
			productionTotList: <any>[],
			dialogFormVisible: false,
			search: '',
			fileList: <any>[],
			settingItem: <any>{},
			form: <any>{
				title: '', // 标题
				ptype: <any>[], // 产品类型ID
				configuration: '', // 产品配置
				configuration_para: <any>[], // 产品配置参数（json格式）
				sprice: '', // 产品起始价格
				eprice: '', // 产品最高价格
				details: '', // 产品详情
				status: 1, // 状态 1已审核 0未审核
			},
			params: <any>{
				offset: 1,
				limit: 10,
				order: 'desc',
			},
			total: 0,
			isAdd: false,
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
			options: <any>[],
		}
	},
	actions: {
		// 更换每页条数
		handleSizeChange(val: number) {
			this.params.offset = 1
			this.params.limit = val
			this.getPinforList()
			console.log(`${val} 更换每页条数`)
		},
		// 更换当前页数
		handleCurrentChange(val: number) {
			this.params.offset = val
			this.getPinforList()
			console.log(`${val} 更换当前页数`)
		},
		// 设置级联选择器
		addDisabledForStatus(arr: any) {
			let newArr = JSON.parse(JSON.stringify(arr))
			newArr.forEach((item: any) => {
				if (item.children.length > 0) {
					item.disabled = false
				} else {
					item.disabled = true
				}
			})
			return newArr
		},

		// 提交修改、添加表单
		async sumitForm(formEl: FormInstance | undefined) {
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
					const params = {
						title: this.form.title,
						ptype: this.form.ptype[1] ? this.form.ptype[1] : undefined,
						configuration: this.form.configuration,
						configuration_para: JSON.stringify(this.form.configuration_para),
						sprice: this.form.sprice,
						eprice: this.form.eprice,
						details: this.form.details,
						status: 1,
					}
					console.log(params, 'params')
					let data: any = new FormData()
					this.fileList[0]?.raw
						? data.append('img_url', this.fileList[0]?.raw)
						: (data = undefined)
					const res: any = this.isAdd
						? await createProduction(params, data)
						: await updateProduction(this.settingItem.id, params, data)
					console.log(res)
					if (res?.code == 200) {
						ElMessage({
							type: 'success',
							message: this.isAdd ? '添加成功' : '修改成功',
						})
						this.dialogFormVisible = false
						this.resetForm()
						setTimeout(async () => {
							await this.getPinforList()
						}, 100)
					}
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},

		// 重置表单
		resetForm() {
			this.form = {
				title: '',
				ptype: <any>[],
				configuration: '',
				configuration_para: <any>[],
				sprice: '',
				eprice: '',
				details: '',
				status: 1,
			}
			this.settingItem = {}
			this.fileList = []
		},

		// 点击修改、添加按钮
		settingRow(
			formEl: FormInstance | undefined,
			isSetting: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			this.dialogFormVisible = true
			this.isAdd = isSetting
			console.log(this.options, 'this.options')
			if (item) {
				let PPid = 0
				console.log(item, '修改item')
				this.options.forEach((j: any) => {
					j.children.forEach((k: any) => {
						if (k.id == item.ptype) {
							PPid = j.value
						}
					})
				})
				this.form = {
					title: item.title,
					details: item.details,
					sprice: item.sprice,
					eprice: item.eprice,
					ptype: [PPid, item.ptype],
					configuration: item.configuration,
					configuration_para: item.configuration_para
						? item.configuration_para
						: [{ tit: '', price: '' }],
				}
				this.fileList = [{ url: item.img_url }]
				this.settingItem = item
			}
		},

		// 获取产品品牌列表页
		async getPinforList() {
			const loading = createLoading()
			this.productionTotList = []
			loading.loading = true
			const res: any = await getProductionList(this.params)
			console.log(res)
			if (res?.code == 200) {
				this.productionTotList = res.data.data ? res.data.data : []
				this.isShowAdd = res.data.total > 20 ? true : false
				this.total = res.data.total
				// await this.getPclassList()
				console.log(this.isShowAdd, 'this.isShowAdd')
			}
			loading.loading = false
		},

		// 获取产品类型列表页
		async getPclassList() {
			const loading = createLoading()
			loading.loading = true
			const res: any = await getProductTypesList()
			console.log(res)
			if (res?.code == 200) {
				let resData = res.data ? res.data : []
				this.options = []
				let list = resData.filter((i: any) => {
					if (i.pid === 0) {
						return i
					}
				})
				list.forEach((element: any) => {
					let data: any = resData.filter((i: any) => {
						if (i.pid === element.id) {
							return { value: i.id, label: i.title }
						}
					})
					data.forEach((items: any) => {
						items.value = items.id
						items.label = items.title
					})
					this.options.push({
						value: element.id,
						label: element.title,
						children: data,
					})
				})
				this.options = this.addDisabledForStatus(this.options)
				console.log(this.options, 'this.options')
			}
			loading.loading = false
		},

		// 添加更多
		async addMore() {
			const loading = createLoading()
			this.params.offset++
			loading.loading = true
			const res: any = await getProductionList(this.params)
			console.log(res)
			if (res?.code == 200) {
				let resData = res.data.data ? res.data.data : []
				if (resData.length > 0) {
					this.productionTotList = this.productionTotList.concat(resData)
				}
				this.isShowAdd = resData.length > 20 ? true : false
				console.log(this.productionTotList)
			}
			loading.loading = false
		},

		// 确认关闭
		handleClose(done: () => void) {
			ElMessageBox.confirm('确定要取消吗？', '警告', {
				type: 'warning',
			})
				.then(() => {
					this.dialogFormVisible = false
					this.resetForm()
					done()
				})
				.catch(() => {})
		},

		// 删除产品
		deleteRow(item: any) {
			const loading = createLoading()
			console.log(item)
			ElMessageBox.confirm('确定是否要删除（' + item.title + '）？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					loading.loading = true
					const res: any = await deleteProduction(item.id)
					console.log(res)
					loading.loading = false
					if (res?.code == 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						this.getPinforList()
					}
				})
				.catch(() => {
					ElMessage({ type: 'info', message: '已取消' })
				})
		},
	},
	persist: false, //是否储存在localStorage
})
