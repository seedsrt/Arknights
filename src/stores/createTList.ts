import { defineStore } from 'pinia'
import { get, post, del } from '~/api/api'
import type { FormInstance, FormRules } from 'element-plus'
const loading = createLoading()
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
				add_score: undefined, // 新增贡献点
				click_num: undefined, // 需要点击次数(最小为1)
				start_time: '', // 任务开始时间 必须明天之后的时间戳
				end_time: '', // 任务时间,时间为0为长期 必须明天之后的时间戳
				sort: '', // 排序 值越大越排在前面
			},
			// 任务列表
			TList: <any>[],
			// 搜索内容
			search: '',
			// 任务类型列表
			taskClassList: <any>[],
		}
	},
	actions: {
		// 获取任务分类
		async getTaskClassList() {
			loading.loading = true
			const res: any = await get('/admin/task/get_tasktype')
			console.log(res, '任务类型列表')
			this.taskClassList = res.data
			loading.loading = false
		},
		//获取任务列表
		async getTaskList() {
			loading.loading = true
			this.TList = []
			const res: any = await get('/admin/task/get_task')
			console.log(res, '任务列表')
			this.TList = res.data
			await this.getTaskClassList()
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
				add_score: undefined,
				click_num: undefined,
				start_time: '',
				end_time: '',
				sort: '',
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
		async onSubmit() {
			console.log(this.form, this.changeForm, this.isChangeTaskList)
			loading.loading1 = true
			const res: any = this.isChangeTaskList
				? await get('/admin/task/update_task', {
						task_name: this.form.task_name,
						task_type: this.form.task_type,
						task_url: this.form.task_url,
						finish_task_url: this.form.finish_task_url,
						add_score: this.form.add_score,
						click_num: this.form.click_num,
						start_time: this.form.start_time / 1000,
						end_time: this.form.end_time / 1000,
						sort: this.form.sort,
						tid: this.changeForm.tid,
				  }) // 修改
				: await get('/admin/task/add_task', {
						task_name: this.form.task_name,
						task_type: this.form.task_type,
						task_url: this.form.task_url,
						finish_task_url: this.form.finish_task_url,
						add_score: this.form.add_score,
						click_num: this.form.click_num,
						start_time: this.form.start_time / 1000,
						end_time: this.form.end_time / 1000,
						sort: this.form.sort,
				  }) // 添加
			console.log(res, '提交修改、更改表单')
			if (res?.code == 200) {
				ElMessage.success(this.isChangeTaskList ? '修改成功' : '添加成功')
			}
			this.resetForm()
			await this.getTaskList()
			this.dialogFormVisible = false
			loading.loading1 = false
		},
		// 点击修改、添加事件
		changeTaskList(isChange: boolean, item?: any) {
			this.isChangeTaskList = isChange
			if (isChange) {
				this.changeForm = item
				this.form = {
					task_name: item.task_name,
					task_type: item.task_type,
					task_url: item.task_url,
					finish_task_url: item.finish_task_url,
					add_score: item.add_score,
					click_num: item.click_num,
					start_time: item.start_time * 1000,
					end_time: item.end_time === 0 ? 0 : item.end_time * 1000,
					sort: item.sort,
				}
				console.log(item, '点击添加')
			}
			this.dialogFormVisible = true
		},
	},
	persist: false, //是否储存在localStorage
})
