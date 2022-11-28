import { defineStore } from 'pinia'
import {
	getPaymentTypeList,
	addPaymentTypeList,
	updatePaymentTypeList,
	delPaymentTypeList,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('Payment', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 判断是否为修改
			isChangePaymentList: false,
			// 添加、修改对话框显隐
			dialogFormVisible: false,
			// 添加、申请的表单内容
			form: <any>{
				name: '', // 添加收款方式
			},
			// 任务列表
			paymentList: <any>[],
			// 搜索内容
			search: '',
		}
	},
	actions: {
		//查询收款方式
		async getPaymentTypeList() {
			const loading = createLoading()
			loading.loading = true
			this.paymentList = []
			const res: any = await getPaymentTypeList()
			console.log(res, '查询收款方式')
			this.paymentList = res.data ? res.data : []
			loading.loading = false
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				name: '',
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
					console.log(this.form, this.changeForm, this.isChangePaymentList)
					const loading = createLoading()
					loading.loading1 = true
					const res: any = this.isChangePaymentList
						? await updatePaymentTypeList({
								ptid: this.changeForm.ptid,
								name: this.form.name,
						  }) // 修改
						: await addPaymentTypeList({ name: this.form.name }) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(
							this.isChangePaymentList ? '修改成功' : '添加成功'
						)
						this.dialogFormVisible = false
						this.resetForm()
						await this.getPaymentTypeList()
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
			this.isChangePaymentList = isChange
			if (isChange) {
				this.changeForm = item
				this.form = {
					name: item.name,
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
					const res: any = await delPaymentTypeList({
						ptid: item.ptid,
					})
					console.log(res)
					loading.loading = false
					if (res.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getPaymentTypeList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
