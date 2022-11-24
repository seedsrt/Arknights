import { defineStore } from 'pinia'
import { getRoleList, updateUser, getUser } from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('User', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 修改对话框显隐
			dialogFormVisible: false,
			// 申请的表单内容
			form: {
				name: '',
				phone: NaN,
				email: '',
				password: '',
				score: NaN,
				role: NaN,
			},
			// 用户列表
			userList: <any>[],
			// 角色列表
			roleList: <any>[],
			// 搜索内容
			search: '',
		}
	},
	actions: {
		//获取角色列表
		async getRoleList() {
			this.roleList = []
			const res: any = await getRoleList()
			console.log(res, '获取角色列表')
			this.roleList = res.data ? res.data : []
		},
		//获取用户列表
		async getUserList() {
			const loading = createLoading()
			loading.loading = true
			this.userList = []
			const res: any = await getUser()
			console.log(res, '获取用户列表')
			this.userList = res.data ? res.data : []
			await this.getRoleList()
			loading.loading = false
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				name: '',
				phone: NaN,
				email: '',
				password: '',
				score: NaN,
				role: NaN,
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
		// 提交修改表单
		async onSubmit(formEl: FormInstance | undefined) {
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
					console.log(this.form, this.changeForm)
					const loading = createLoading()
					loading.loading1 = true
					const res: any = await updateUser({
						name: this.form.name,
						phone: this.form.phone ? this.form.phone : undefined,
						email: this.form.email ? this.form.email : undefined,
						password: this.form.password,
						score: this.form.score,
						role: this.form.role,
						id: this.changeForm.id,
					}) // 修改
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success('修改成功')
						this.dialogFormVisible = false
						this.resetForm()
						await this.getUserList()
					}
					loading.loading1 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
		// 点击修改事件
		changeRoleList(formEl: FormInstance | undefined, item?: any) {
			formEl?.clearValidate()
			this.changeForm = item
			this.form = {
				name: item.name,
				phone: item.phone,
				email: item.email,
				password: item.password,
				score: item.score,
				role: item.role,
			}
			console.log(item, '点击添加')
			this.dialogFormVisible = true
		},
	},
	persist: false, //是否储存在localStorage
})
