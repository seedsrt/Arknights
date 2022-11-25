import { defineStore } from 'pinia'
import {
	getTaskAddresses,
	getTaskList,
	addTaskList,
	updateTaskList,
	deleteTaskList,
	getTaskTypesList,
	getRoleList,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('TList', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 判断是否为修改
			isChangeTaskList: false,
			// 添加、修改对话框显隐
			dialogFormVisible: false,
			// 添加、申请的表单内容
			form: <any>{
				task_name: '', // 任务名称
				task_type: undefined, // 任务类型
				task_url: '', // 任务地址
				finish_task_url: '', // 任务完成接口地址
				click_num: undefined, // 需要点击次数(最小为1)
				start_time: '', // 任务开始时间 必须明天之后的时间戳
				end_time: '', // 任务时间,时间为0为长期 必须明天之后的时间戳
				sort: '', // 排序 值越大越排在前面
				finish_score: undefined, // 完成度
				role: undefined, // 用户角色id
			},
			// 任务列表
			TList: <any>[],
			// 搜索内容
			search: '',
			// 任务分类选项列表
			taskClassList: <any>[],
			// 任务地址选项列表
			taskAddressList: <any>[],
			// 角色选项列表
			roleList: <any>[],
		}
	},
	actions: {
		// 获取角色列表
		async getRoleList() {
			const res: any = await getRoleList()
			console.log(res, '获取角色列表')
			this.roleList = res.data ? res.data : []
		},
		// 获取任务分类
		async getTaskClassList() {
			const res: any = await getTaskTypesList()
			console.log(res, '获取任务分类')
			this.taskClassList = res.data ? res.data : []
		},
		// 获取任务地址
		async getTaskAddressList() {
			const res: any = await getTaskAddresses()
			console.log(res, '获取任务地址')
			this.taskAddressList = res.data ? res.data : []
		},
		//获取任务列表
		async getTaskList() {
			const loading = createLoading()
			loading.loading = true
			this.TList = []
			const res: any = await getTaskList()
			console.log(res, '任务列表')
			this.TList = res.data ? res.data : []
			await this.getTaskClassList()
			await this.getTaskAddressList()
			await this.getRoleList()
			loading.loading = false
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				task_name: '',
				task_type: undefined,
				task_url: '',
				finish_task_url: '',
				click_num: undefined,
				start_time: '',
				end_time: '',
				sort: '',
				finish_score: undefined,
				role: undefined,
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
			console.log(this.changeForm.start_time * 1000 == this.form.start_time)
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
					console.log(this.form, this.changeForm, this.isChangeTaskList)
					const loading = createLoading()
					loading.loading1 = true
					const res: any = this.isChangeTaskList
						? await updateTaskList({
								task_name: this.form.task_name,
								task_type: this.form.task_type,
								task_url: this.form.task_url,
								finish_task_url: this.taskAddressList.find((item: any) => {
									return item.task_url == this.form.task_url
								})?.finish_task_url,
								click_num: this.form.click_num,
								start_time:
									this.changeForm.start_time * 1000 == this.form.start_time
										? undefined
										: this.form.start_time / 1000,
								end_time:
									this.changeForm.end_time * 1000 == this.form.end_time
										? undefined
										: this.form.end_time / 1000,
								sort: this.form.sort,
								finish_score: this.form.finish_score,
								tid: this.changeForm.tid,
								role: this.form.role,
						  }) // 修改
						: await addTaskList({
								task_name: this.form.task_name,
								task_type: this.form.task_type,
								task_url: this.form.task_url,
								finish_task_url: this.taskAddressList.find((item: any) => {
									return item.task_url == this.form.task_url
								})?.finish_task_url,
								click_num: this.form.click_num,
								start_time: this.form.start_time / 1000,
								end_time: this.form.end_time / 1000,
								sort: this.form.sort,
								finish_score: this.form.finish_score,
								role: this.form.role,
						  }) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(this.isChangeTaskList ? '修改成功' : '添加成功')
						this.dialogFormVisible = false
						this.resetForm()
						await this.getTaskList()
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
			this.isChangeTaskList = isChange
			if (isChange) {
				this.changeForm = item
				this.form = {
					task_name: item.task_name,
					task_type: item.task_type,
					task_url: item.task_url,
					finish_task_url: item.finish_task_url,
					click_num: item.click_num,
					start_time: item.start_time * 1000,
					end_time: item.end_time * 1000,
					sort: item.sort,
					finish_score: item.finish_score,
					role: item.role,
				}
				console.log(
					this.changeForm.start_time * 1000,
					this.form.start_time,
					'time'
				)
				console.log(item, '点击添加')
			}
			this.dialogFormVisible = true
		},
		deleteRow(item: any) {
			const loading = createLoading()
			console.log(typeof item.tid)
			ElMessageBox.confirm(
				'确定是否要删除（' + item.task_name + '）？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					loading.loading = true
					const res: any = await deleteTaskList({
						tid: item.tid,
					})
					console.log(res)
					loading.loading = false
					if (res?.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getTaskList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
