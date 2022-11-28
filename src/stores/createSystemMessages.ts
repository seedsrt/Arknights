import { defineStore } from 'pinia'
import {
	getSystemMessagesList,
	addSystemMessages,
	updateSystemMessages,
	delSystemMessages,
	getUser,
	getSendSystemMessagesName,
	sendSystemMessages,
	getRoleList,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('SystemMessages', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 获取用户报告列表参数
			params: <any>{
				offset: 1,
				limit: 10,
				order: 'desc',
			},
			form: <any>{
				report_content: '', // 报告内容
				user_id: <any>[], // 用户ID
				title: '',
			},
			// 用户报告列表总数
			total: 0,
			dialogFormVisible: false,
			// dialogFormVisibleDetail: false,
			// 报告列表
			systemMessagesList: <any>[],
			// 搜索内容
			search: '',
			// 点击表格详情数据
			details: <any>{},
			isChangeSystemMessagesList: false,
			// 用户列表
			userList: <any>[],
			// 上传语音列表
			fileList: <any>[],
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
			timer: <any>'',
			sendDialogVisible: false,
			send_user_name: '',
			settingSend: <any>{},
			sendUserNameList: <any>[],
			systemMessagesNameList: <any>[],
		}
	},
	actions: {
		async submitSend() {
			const loading = createLoading()
			loading.loading3 = true
			const res: any = await sendSystemMessages({
				id: this.settingSend.smid,
				send_user_name: this.send_user_name,
			})
			if (res?.code == 200) {
				ElMessage.success('发送成功')
				this.sendDialogVisible = false
				this.send_user_name = ''
				if (this.systemMessagesNameList.length == 1) {
					this.send_user_name = this.systemMessagesNameList[0].value
				}
			}
			loading.loading3 = false
		},
		closeSend() {
			this.sendDialogVisible = false
			this.send_user_name = ''
			if (this.systemMessagesNameList.length == 1) {
				this.send_user_name = this.systemMessagesNameList[0].value
			}
		},
		async getSendSystemMessagesName() {
			const loading = createLoading()
			loading.loading = true
			this.systemMessagesNameList = []
			const { data } = await getSendSystemMessagesName()
			console.log(data, 'getSendSystemMessagesName')
			this.systemMessagesNameList = data ? data : []
			if (this.systemMessagesNameList.length == 1) {
				this.send_user_name = this.systemMessagesNameList[0].value
			}
			loading.loading = false
		},
		groupBy(array: any, f: any) {
			const groups = <any>{}
			array.forEach(function (o: any) {
				//注意这里必须是forEach 大写
				const group = JSON.stringify(f(o))
				groups[group] = groups[group] || []
				groups[group].push(o)
			})
			return Object.keys(groups).map(function (group) {
				return groups[group]
			})
		},
		//获取用户报告列表
		async getSystemMessagesList() {
			const loading = createLoading()
			loading.loading = true
			this.systemMessagesList = []
			const { data } = await getSystemMessagesList(this.params)
			console.log(data, '获取用户列表')
			this.systemMessagesList = data ? data?.data : []
			this.total = data ? data.total : 0
			loading.loading = false
		},
		//获取用户列表
		async getUserList() {
			const loading = createLoading()
			loading.loading = true
			this.userList = []
			const res: any = await getUser()
			const resRole: any = await getRoleList()
			console.log(res, resRole, '获取用户列表')
			if (res?.code === 200 || resRole?.code === 200) {
				resRole?.data.forEach((item: any) => {
					console.log(item)
					this.userList.push({
						roleName: item.role_name,
						role: item.role,
						options: res?.data.filter((items: any) => {
							if (item.role == items.role) {
								return items
							}
						}),
					})
				})
			}
			console.log(this.userList, 'this.userList')
			loading.loading = false
		},
		handleSizeChange(val: number) {
			this.params.offset = 1
			this.params.limit = val
			this.getSystemMessagesList()
			console.log(`${val} 更换每页条数`)
		},
		handleCurrentChange(val: number) {
			this.params.offset = val
			this.getSystemMessagesList()
			console.log(`${val} 更换当前页数`)
		},

		resetForm() {
			this.changeForm = {}
			this.form = {
				report_content: '',
				user_id: <any>[],
			}
			this.fileList = []
		},

		// 提交、修改表单
		async onSubmit(formEl: FormInstance | undefined) {
			console.log(this.form, 'form')
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
					const loading = createLoading()
					loading.loading1 = true
					let data: any = new FormData()
					this.fileList[0]?.raw
						? data.append('img_url', this.fileList[0]?.raw)
						: (data = undefined)
					const res: any = this.isChangeSystemMessagesList
						? await updateSystemMessages(
								this.changeForm.smid,
								{
									user_id: this.form.user_id.toString(),
									report_content: this.form.report_content,
									title: this.form.title,
								},
								data
						  ) // 修改
						: await addSystemMessages(
								{
									user_id: this.form.user_id.toString(),
									report_content: this.form.report_content,
									title: this.form.title,
								},
								data
						  ) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(
							this.isChangeSystemMessagesList ? '修改成功' : '添加成功'
						)
						this.dialogFormVisible = false
						this.resetForm()
						await this.getSystemMessagesList()
					}
					loading.loading1 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
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

		// 搜索
		searchDetail() {
			if (this.timer) {
				clearTimeout(this.timer)
			}
			this.timer = setTimeout(async () => {
				const loading = createLoading()
				this.systemMessagesList = []
				loading.loading2 = true
				const res: any = await getSystemMessagesList({
					...this.params,
					title: this.search,
				})
				console.log(res)
				if (res?.code == 200) {
					this.systemMessagesList = res.data.data ? res.data.data : []
					this.total = res.data.total
				}
				loading.loading2 = false
				console.log(this.search)
			}, 600)
		},
		// 点击修改、添加事件
		changeReportList(
			formEl: FormInstance | undefined,
			isChange: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			console.log(item)
			this.isChangeSystemMessagesList = isChange
			if (isChange) {
				this.changeForm = item
				this.form = {
					report_content: item.report_content,
					user_id: item.user_id.split(',').map(Number),
					title: item.title,
				}
				this.fileList = item.img_url
					? [{ url: item.img_url, name: '报告文件' }]
					: []
				console.log(this.form, '点击添加')
			}
			this.dialogFormVisible = true
		},

		// 发送报告
		sendReport(item: any) {
			console.log(item)

			this.settingSend = item
			this.sendDialogVisible = true
		},

		deleteRow(item: any) {
			console.log(item)

			const loading = createLoading()
			ElMessageBox.confirm(
				'确定是否要删除（' + item.title + '的报告）？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					loading.loading = true
					const res: any = await delSystemMessages(item.smid)
					console.log(res)
					loading.loading = false
					if (res.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getSystemMessagesList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
