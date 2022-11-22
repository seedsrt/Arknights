import { defineStore } from 'pinia'
import {
	getTaskAddresses,
	addTaskAddresses,
	updateTaskAddresses,
	deleteTaskAddresses,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('TAddress', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 判断是否为修改
			isChangeTaskAddress: false,
			// 对话框显隐
			dialogFormVisible: false,
			form: {
				url_name: '', // 任务类型名称
				task_url: '', // 任务跳转地址
				finish_task_url: '', // 任务完成地址(后端接口)
			},
			// 搜索内容
			search: '',
			// 任务地址列表
			TAddressList: [],
		}
	},
	actions: {
		// 获取任务地址列表
		async getTaskAddressList() {
			const loading = createLoading()
			loading.loading = true
			const res: any = await getTaskAddresses()
			console.log(res, '获取任务地址列表')
			this.TAddressList = res.data ? res.data : []
			loading.loading = false
		},
		// 点击修改、添加事件
		changeTaskList(
			formEl: FormInstance | undefined,
			isChange: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			this.isChangeTaskAddress = isChange
			if (isChange) {
				this.changeForm = item
				this.form = {
					url_name: item.url_name,
					task_url: item.task_url,
					finish_task_url: item.finish_task_url,
				}
				console.log(item, '点击添加')
			}
			this.dialogFormVisible = true
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				url_name: '',
				task_url: '',
				finish_task_url: '',
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
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
					console.log(this.form, this.changeForm, this.isChangeTaskAddress)
					const loading = createLoading()
					loading.loading1 = true
					const res: any = this.isChangeTaskAddress
						? await updateTaskAddresses({
								url_name: this.form.url_name,
								task_url: this.form.task_url,
								finish_task_url: this.form.finish_task_url,
								taid: this.changeForm.taid,
						  }) // 修改
						: await addTaskAddresses({
								url_name: this.form.url_name,
								task_url: this.form.task_url,
								finish_task_url: this.form.finish_task_url,
						  }) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(
							this.isChangeTaskAddress ? '修改成功' : '添加成功'
						)
						this.resetForm()
						await this.getTaskAddressList()
						this.dialogFormVisible = false
					}
					loading.loading1 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
		deleteRow(item: any) {
			const loading = createLoading()
			ElMessageBox.confirm(
				'确定是否要删除（' + item.url_name + '）？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					loading.loading = true
					const res: any = await deleteTaskAddresses({
						taid: item.taid,
					})
					console.log(res)
					loading.loading = false
					if (res?.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getTaskAddressList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
