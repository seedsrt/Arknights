import { defineStore } from 'pinia'
import { get, post } from '~/api/api'
import type { FormInstance } from 'element-plus'
export default defineStore('TCompletion', {
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
				task_finish_score_name: '', // 任务完成度名称
				add_score: undefined, // 新增贡献点
				need_finish_score: undefined, // 需要完成度
				sort: undefined, // 排序 值越大越排在前面
			},
			// 任务列表
			TCompletionList: <any>[],
			// 搜索内容
			search: '',
		}
	},
	actions: {
		//获取任务完成度列表
		async getTaskList() {
			const loading = createLoading()
			loading.loading = true
			this.TCompletionList = []
			const res: any = await get('/admin/task/get_finishscore')
			console.log(res, '获取任务完成度列表')
			this.TCompletionList = res.data ? res.data : []
			loading.loading = false
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				task_finish_score_name: '',
				add_score: undefined,
				need_finish_score: undefined,
				sort: undefined,
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
					console.log(this.form, this.changeForm, this.isChangeTaskList)
					const loading = createLoading()
					loading.loading1 = true
					const res: any = this.isChangeTaskList
						? await get('/admin/task/update_finishscore', { 
								task_finish_score_name: this.form.task_finish_score_name,
								add_score: this.form.add_score,
								need_finish_score: this.form.need_finish_score,
								sort: this.form.sort,
								tfid: this.changeForm.tfid,
						  }) // 修改
						: await get('/admin/task/add_finishscore', {
								task_finish_score_name: this.form.task_finish_score_name,
								add_score: this.form.add_score,
								need_finish_score: this.form.need_finish_score,
								sort: this.form.sort,
						  }) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(this.isChangeTaskList ? '修改成功' : '添加成功')
						this.resetForm()
						await this.getTaskList()
						this.dialogFormVisible = false
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
					task_finish_score_name: item.task_finish_score_name,
					add_score: item.add_score,
					sort: item.sort,
					need_finish_score: item.need_finish_score,
				}
				console.log(item, '点击添加')
			}
			this.dialogFormVisible = true
		},
		deleteRow(item: any) {
			const loading = createLoading()
			console.log(item)
			ElMessageBox.confirm(
				'确定是否要删除（' + item.task_finish_score_name + '）？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					loading.loading = true
					const res: any = await get('/admin/task/del_finishscore', {
						tfid: item.tfid,
					})
					console.log(res)
					loading.loading = false
					if (res.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getTaskList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
