import { defineStore } from 'pinia'
import { getVersionList, addVersion, delVersionList } from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('Version', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 判断是否为修改
			isChangeVersionList: false,
			// 添加、修改对话框显隐
			dialogFormVisible: false,
			// 添加、申请的表单内容
			form: <any>{
				title: '',
				content: '',
				version: '',
				min_version: '',
				is_update: false,
			},
			// 任务列表
			versionList: <any>[],
			// 搜索内容
			search: '',
			fileList: <any>[],
			dialogImageUrl: '',
			dialogVisible: false,
			disabled: false,
		}
	},
	actions: {
		deleteRow(item: any) {
			const loading = createLoading()
			console.log(typeof item.tid)
			ElMessageBox.confirm('确定是否要删除（' + item.title + '）？', '警告', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					loading.loading = true
					const res: any = await delVersionList({
						id: item.id,
					})
					console.log(res)
					loading.loading = false
					if (res?.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getVersionList()
					}
				})
				.catch(() => {})
		},
		//获取角色列表
		async getVersionList() {
			const loading = createLoading()
			loading.loading = true
			this.versionList = []
			const res: any = await getVersionList()
			console.log(res, '任务列表')
			this.versionList = res.data ? res.data : []
			loading.loading = false
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				title: '',
				content: '',
				version: '',
				min_version: '',
				is_update: false,
			}
			this.fileList = <any>[]
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
			console.log(this.fileList)
			if (!formEl) return
			await formEl.validate(async (valid: any, fields: any) => {
				if (valid) {
					const loading = createLoading()
					loading.loading1 = true
					let data: any = new FormData()
					this.fileList[0]?.raw
						? data.append('file_url', this.fileList[0]?.raw)
						: (data = undefined)
					console.log(data, 'this.data')
					const res: any = await addVersion(
						{
							title: this.form.title,
							content: this.form.content,
							version: this.form.version,
							min_version: this.form.min_version,
							is_update: this.form.is_update ? 1 : 0,
						},
						data
					)
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success('添加成功')
						this.dialogFormVisible = false
						this.resetForm()
						await this.getVersionList()
					}
					loading.loading1 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
		// 点击修改、添加事件
		changeVersionList(formEl: FormInstance | undefined, item?: any) {
			formEl?.clearValidate()
			this.changeForm = item
			this.form = {
				role_name: item.role_name,
			}
			console.log(item, '点击添加')
			this.dialogFormVisible = true
		},
	},
	persist: false, //是否储存在localStorage
})
