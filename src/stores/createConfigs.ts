import { defineStore } from 'pinia'
import {
	addConfigs,
	getConfigsList,
	updateConfigs,
	delConfigs,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('Configs', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 判断是否为修改
			isChangeConfigsList: false,
			// 添加、修改对话框显隐
			dialogFormVisible: false,
			// 添加、申请的表单内容
			form: <any>{
				name: '', // 配置项键名
				content: '', // 更新内容
				value: '', // 配置项键值 1表示开启 0 关闭
			},
			// 获取配置信息列表
			params: <any>{
				offset: 1,
				limit: 10,
				order: 'desc',
			},
			total: 0,
			configsList: <any>[],
			search: '',
			timer: <any>undefined,
		}
	},
	actions: {
		// 更换每页条数
		handleSizeChange(val: number) {
			this.params.offset = 1
			this.params.limit = val
			this.getConfigsList()
			console.log(`${val} 更换每页条数`)
		},
		// 更换当前页数
		handleCurrentChange(val: number) {
			this.params.offset = val
			this.getConfigsList()
			console.log(`${val} 更换当前页数`)
		},
		searchDetail() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(async () => {
				const loading = createLoading()
				loading.loading = true
				this.configsList = []
				const res: any = await getConfigsList({
					...this.params,
					name: this.search,
				})
				console.log(res, '任务列表')
				if (res?.data) {
					this.configsList = res.data.data ? res.data.data : []
				} else {
					this.configsList = []
				}
				loading.loading = false
			}, 600)
		},
		//获取配置信息列表
		async getConfigsList() {
			const loading = createLoading()
			loading.loading = true
			this.configsList = []
			const res: any = await getConfigsList({
				...this.params,
			})
			console.log(res, '任务列表')
			if (res.data) {
				this.configsList = res.data.data ? res.data.data : []
				this.total = res.data.total
			} else {
				this.configsList = []
			}
			loading.loading = false
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				name: '',
				content: '',
				value: '',
			}
		},
		// 关闭对话框
		handleClose(done: () => void) {
			ElMessageBox.confirm('确定是否要关闭？表单内容将会清空', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.dialogFormVisible = false
					this.resetForm()
					done()
				})
				.catch(() => {})
		},
		// 提交、修改表单
		async onSubmit(formEl: FormInstance | undefined) {
			console.log(this.form, this.changeForm)
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
					const loading = createLoading()
					loading.loading1 = true
					const res: any = this.isChangeConfigsList
						? await updateConfigs(this.changeForm.id, this.form) // 修改
						: await addConfigs(this.form) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(
							this.isChangeConfigsList ? '修改成功' : '添加成功'
						)
						this.dialogFormVisible = false
						this.resetForm()
						await this.getConfigsList()
					}
					loading.loading1 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
		// 点击修改、添加事件
		changeTaskList(
			formEl: FormInstance | undefined,
			isChange: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			this.isChangeConfigsList = isChange
			if (isChange) {
				this.changeForm = item
				this.form = {
					name: item.name,
					content: item.content,
					value: item.value,
				}
				console.log(item, '点击添加')
			}
			this.dialogFormVisible = true
		},
		deleteRow(item: any) {
			const loading = createLoading()
			console.log(typeof item.tid)
			ElMessageBox.confirm('确定是否要删除（' + item.name + '）？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					loading.loading = true
					const res: any = await delConfigs(item.id)
					console.log(res)
					loading.loading = false
					if (res?.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getConfigsList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
