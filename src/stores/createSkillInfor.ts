import { defineStore } from 'pinia'
import {
	createSkills,
	getSkillsList,
	getSkillsDetail,
	updateSkills,
	deleteSkills,
	getProductTypesList,
	getSkillsTypes,
} from '~/api/globalApi'
import type { FormInstance } from 'element-plus'
export default defineStore('skillInfor', {
	state() {
		return {
			// 当前修改表单内容
			changeForm: <any>{},
			// 判断是否为修改
			isChangeSkillInfor: false,
			// 对话框显隐
			dialogFormVisible: false,
			form: {
				skill_type: '', // 1为基础了解 2进阶知识
				ptype: <any>[], // 产品类型ID
				content: '', // 技能信息内容
				status: true, // 状态 0为未审核 1为已审核
			},
			// 搜索内容
			search: '',
			// 任务地址列表
			skillInforList: [],
			// 获取技能信息列表参数
			params: <any>{
				offset: 1,
				limit: 20,
				order: 'desc',
			},
			isShowAdd: false,
			totleProduction: 0,
			// 技能类型选择
			optionsSkill: <any>[],
			// 产品类型
			optionsProd: <any>[],
		}
	},
	actions: {
		handleSizeChange(val: number) {
			console.log(`${val} items per page`)
		},
		handleCurrentChange(val: number) {
			console.log(`${val} items per page`)
		},
		// 设置级联选择器
		addDisabledForStatus(arr: any) {
			let newArr = JSON.parse(JSON.stringify(arr))
			newArr.forEach((item: any) => {
				if (item.children.length > 0) {
					item.disabled = false
				} else {
					item.disabled = true
				}
			})
			return newArr
		},
		// 获取产品类型列表
		async getProList() {
			const loading = createLoading()
			loading.loading = true
			const res: any = await getProductTypesList()
			const resSkill: any = await getSkillsTypes()
			console.log(res, '获取产品类型列表')
			console.log(resSkill, '获取技能分类列表')
			if (res?.code == 200) {
				let resData = res.data ? res.data : []
				this.optionsSkill = resSkill.data
				let list = resData.filter((i: any) => {
					if (i.pid === 0) {
						return i
					}
				})
				list.forEach((element: any) => {
					let data: any = resData.filter((i: any) => {
						if (i.pid === element.id) {
							return { value: i.id, label: i.title }
						}
					})
					data.forEach((items: any) => {
						items.value = items.id
						items.label = items.title
					})
					this.optionsProd.push({
						value: element.id,
						label: element.title,
						children: data,
					})
				})
				this.optionsProd = this.addDisabledForStatus(this.optionsProd)
			}
			loading.loading = false
		},
		// 获取技能信息列表
		async getSkillInforList() {
			const loading = createLoading()
			loading.loading = true
			this.totleProduction = 0
			this.params.offset = 1
			const res: any = await getSkillsList(this.params)
			console.log(res, '获取技能信息列表')
			if (res?.code == 200) {
				let resData = res.data.data ? res.data.data : []
				this.skillInforList = resData
				this.isShowAdd = res.data?.total > 20 ? true : false
				this.totleProduction = res.data?.total
			}
			loading.loading = false
		},
		async addMore() {
			const loading = createLoading()
			this.params.offset++
			loading.loading = true
			const res: any = await getSkillsList(this.params)
			console.log(res)
			let resData = res.data.data ? res.data.data : []
			if (resData.length > 0) {
				this.skillInforList = this.skillInforList.concat(resData)
			}
			this.isShowAdd = resData.length > 20 ? true : false
			console.log(this.skillInforList)
			loading.loading = false
		},
		// 点击修改、添加事件
		changeSkillList(
			formEl: FormInstance | undefined,
			isChange: boolean,
			item?: any
		) {
			formEl?.clearValidate()
			this.isChangeSkillInfor = isChange
			if (isChange) {
				this.changeForm = item
				let PPid = 0
				console.log(item, '修改item')
				this.optionsProd.forEach((j: any) => {
					j.children.forEach((k: any) => {
						if (k.id == item.ptype) {
							PPid = j.value
						}
					})
				})
				this.form = {
					skill_type: item.skill_type,
					ptype: [PPid, this.changeForm.ptype],
					content: item.content,
					status: item.status == 1 ? true : false,
				}
				console.log(this.form, '点击添加')
			}
			this.dialogFormVisible = true
		},
		// 重置表单内容
		resetForm() {
			this.changeForm = {}
			this.form = {
				skill_type: '',
				ptype: '',
				content: '',
				status: true,
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
					console.log(this.form)
					const loading = createLoading()
					loading.loading1 = true
					const res: any = this.isChangeSkillInfor
						? await updateSkills(this.changeForm.id, {
								skill_type: this.form.skill_type,
								ptype: this.form.ptype[1],
								content: this.form.content,
								status: this.form.status ? 1 : 0,
						  }) // 修改
						: await createSkills({
								skill_type: this.form.skill_type,
								ptype: this.form.ptype[1],
								content: this.form.content,
								status: this.form.status ? 1 : 0,
						  }) // 添加
					console.log(res, '提交修改、更改表单')
					if (res?.code == 200) {
						ElMessage.success(this.isChangeSkillInfor ? '修改成功' : '添加成功')
						this.resetForm()
						await this.getSkillInforList()
						this.dialogFormVisible = false
					}
					loading.loading1 = false
				} else {
					ElMessage.warning('请填写必填项')
				}
			})
		},
		// 删除
		deleteRow(item: any) {
			const loading = createLoading()
			ElMessageBox.confirm(
				'确定是否要删除（' + item.skill_type + '）？',
				'警告',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
				.then(async () => {
					loading.loading = true
					const res: any = await deleteSkills(item.id)
					console.log(res)
					loading.loading = false
					if (res?.code === 200) {
						ElMessage({ type: 'success', message: '删除成功' })
						await this.getSkillInforList()
					}
				})
				.catch(() => {})
		},
	},
	persist: false, //是否储存在localStorage
})
