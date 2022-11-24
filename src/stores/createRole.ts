import { defineStore } from 'pinia'
import { getRoleList, addRole, updateRole, delRole } from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('Role', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 判断是否为修改
			isChangeRoleList: false,
			// 添加、修改对话框显隐
			dialogFormVisible: false,
			// 添加、申请的表单内容
			form: <any>{
				role_name: '', // 角色名称
			},
			// 任务列表
			roleList: <any>[],
			// 搜索内容
			search: '',
		}
	},
	actions: {
		//获取角色列表
		async getRoleList() {
			const loading = createLoading()
			loading.loading = true
			this.roleList = []
			const res: any = await getRoleList()
			console.log(res, '任务列表')
			this.roleList = res.data ? res.data : []
			loading.loading = false
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				role_name: '',
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
					console.log(this.form, this.changeForm, this.isChangeRoleList)
					const loading = createLoading()
					loading.loading1 = true
					const res: any = this.isChangeRoleList
						? await updateRole({
								role: this.changeForm.role,
								role_name: this.form.role_name,
						  }) // 修改
						: await addRole({
								role_name: this.form.role_name,
						  }) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(this.isChangeRoleList ? '修改成功' : '添加成功')
						this.dialogFormVisible = false
						this.resetForm()
						await this.getRoleList()
					}
					loading.loading1 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
		// 点击修改、添加事件
		changeRoleList(
			formEl: FormInstance | undefined,
			isChange: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			this.isChangeRoleList = isChange
			if (isChange) {
				this.changeForm = item
				this.form = {
					role_name: item.role_name,
				}
				console.log(item, '点击添加')
			}
			this.dialogFormVisible = true
		},
		deleteRow(item: any) {
			const loading = createLoading()
			console.log(typeof item.tid)
			ElMessageBox.confirm(
				'确定是否要删除（' + item.role_name + '）？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					loading.loading = true
					const res: any = await delRole({
						role: item.role,
					})
					console.log(res)
					loading.loading = false
					if (res.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getRoleList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
