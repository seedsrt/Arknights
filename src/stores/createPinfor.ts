import { defineStore } from 'pinia'
import { router } from '~/modules/router'
import { get, post, del } from '~/api/api'
const loading = createLoading()
export default defineStore('PInfor', {
	state() {
		return {
			productionTotList: <any>[],
			dialogFormVisible: false,
			search: '',
			fileList: <any>[],
			settingItem: <any>{},
			form: <any>{
				title: '',
				ptype: <any>[],
				configuration: '',
				price: '',
				details: '',
				status: 1,
			},
			isAdd: false,
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
			options: <any>[],
		}
	},
	actions: {
		// 提交修改、添加表单
		async sumitForm() {
			const params = {
				title: this.form.title,
				ptype: this.form.ptype[1] ? this.form.ptype[1] : undefined,
				configuration: this.form.configuration,
				price: this.form.price,
				details: this.form.details,
				status: 1,
			}
			console.log(this.form)
			let data: any = new FormData()
			this.fileList[0]?.raw
				? data.append('img_url', this.fileList[0]?.raw)
				: (data = undefined)
			const res: any = this.isAdd
				? await post('/admin/product/create', params, data)
				: post('/admin/product/update/' + this.settingItem.id, params, data)
			console.log(res)
			if (res.msg == '创建成功') {
				ElMessage({
					type: 'success',
					message: this.isAdd ? '添加成功' : '修改成功',
				})
			}
			this.getPinforList()
			this.dialogFormVisible = false
			this.resetForm()
		},
		resetForm() {
			this.form = {
				title: '',
				ptype: [],
				configuration: '',
				price: '',
				details: '',
				status: 1,
			}
			this.settingItem = {}
			this.fileList = []
		},
		// 点击修改、添加按钮
		settingRow(isSetting: boolean, item?: any) {
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
					price: item.price,
					ptype: [PPid, item.ptype],
					configuration: item.configuration,
				}
				this.fileList = [{ url: item.img_url }]
				this.settingItem = item
			}
		},
		async getPinforList() {
			const params = {
				offset: 1,
				limit: 10,
				order: 'desc',
			}
			loading.loading = true
			const res: any = await get('/admin/product/list', params)
			console.log(res)
			this.productionTotList = res.data.data
			await this.getPclassList()
			loading.loading = false
		},
		// 获取产品类型列表页
		async getPclassList() {
			loading.loading = true
			const res: any = await get('/admin/product/types/list')
			console.log(res)
			this.options = []
			let list = res.data.filter((i: any) => {
				if (i.pid === 0) {
					return i
				}
			})
			list.forEach((element: any) => {
				let data: any = res.data.filter((i: any) => {
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
			console.log(this.options, 'this.options')

			loading.loading = false
		},
		// 确认关闭
		handleClose(done: () => void) {
			ElMessageBox.confirm('确定要取消吗？', '警告', {
				type: 'warning',
			})
				.then(() => {
					this.resetForm()
					this.dialogFormVisible = false
					done()
				})
				.catch(() => {
					// catch error
				})
		},
		// 删除产品
		deleteRow(item: any) {
			console.log(item)
			ElMessageBox.confirm('确定是否要删除（' + item.title + '）？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					loading.loading = true
					const res: any = await del('/admin/product/del/' + item.id)
					console.log(res)
					loading.loading = false
					if (res.msg == '删除成功') {
						ElMessage({ type: 'success', message: '删除成功' })
					}
					this.getPinforList()
				})
				.catch(() => {
					ElMessage({ type: 'info', message: '已取消' })
				})
		},
	},
	persist: false, //是否储存在localStorage
})
