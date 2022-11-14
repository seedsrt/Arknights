import { defineStore } from 'pinia'
import { get, post, del } from '~/api/api'
const loading = createLoading()
export default defineStore('TClass', {
	state() {
		return {
			// 当前修改表单
			changeForm: <any>{},
			// 判断是否为修改
			isChangeTaskClass: false,
			// 添加、修改对话框显隐
			dialogFormVisible: false,
			// 添加、申请的表单内容
			form: {
				task_type_name: '', //任务类型名称
				task_type: 0, //任务类型id
			},
			// 任务分类列表
			TClassList: <any>[],
			// 搜索内容
			search: '',
		}
	},
	actions: {
		// 提交修改、添加表单内容
		async onSubmit() {
			console.log(this.form, this.isChangeTaskClass)
			loading.loading1 = true
			const res: any = this.isChangeTaskClass
				? await get('/admin/task/update_tasktype', this.form) // 修改
				: await get('/admin/task/add_tasktype', {
						task_type_name: this.form.task_type_name,
				  }) // 添加
			console.log(res, '提交修改、更改表单')
			if (res?.code == 200) {
				ElMessage.success(this.isChangeTaskClass ? '修改成功' : '添加成功')
			}
			this.resetForm()
			await this.getTaskClassList()
			this.dialogFormVisible = false
			loading.loading1 = false
		},
		// 获取任务分类
		async getTaskClassList() {
			loading.loading = true
			this.TClassList = []
			const res: any = await get('/admin/task/get_tasktype')
			console.log(res, '任务类型列表')
			this.TClassList = res.data
			loading.loading = false
		},
		// 点击修改、添加事件
		async changeTaskClass(isChange: boolean, item?: any) {
			this.isChangeTaskClass = isChange
			if (isChange) {
				this.changeForm = item
				this.form.task_type_name = item.task_type_name
				this.form.task_type = item.task_type
				console.log(item, isChange, '点击修改、添加')
			}
			this.dialogFormVisible = true
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				task_type_name: '',
				task_type: 0,
			}
		},
		// 关闭对话框事件
		handleClosedialog(done: () => void) {
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
		// 删除任务分类
		deleteTaskClass(item: any) {
			console.log(item, '删除任务分类')
			ElMessageBox.confirm(
				'确定是否要删除（' + item.task_type_name + '）？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					loading.loading = true
					const res: any = await get('/admin/task/del_tasktype', {
						task_type: item.task_type,
					})
					console.log(res, '删除是否成功')
					loading.loading = false
					await this.getTaskClassList()
					if (res?.code == 200) {
						ElMessage({ type: 'success', message: '删除成功' })
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
