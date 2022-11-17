<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const TAddress = createTAddress()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	url_name: [
		{ required: true, message: '请输入任务地址名称', trigger: 'blur' },
	],
	task_url: [{ required: true, message: '请输入任务地址', trigger: 'blur' }],
	finish_task_url: [
		{ required: true, message: '请输入完成地址', trigger: 'blur' },
	],
})
const filterTableInforData = computed(() =>
	TAddress.TAddressList.filter(
		(data: any) =>
			!TAddress.search ||
			data.url_name.toLowerCase().includes(TAddress.search.toLowerCase())
	)
)
onMounted(() => {
	TAddress.getTaskAddressList()
})
</script>

<template>
	<div style="position: absolute; width: 100%">
		<el-card v-loading="loading.loading">
			<el-table
				ref="multipleTableRef"
				table-layout="auto"
				size="large"
				:data="filterTableInforData"
				stripe
				style="width: auto"
				max-height="680px"
				fit
				lazy
			>
				<el-table-column sortable prop="url_name" label="任务名称" />
				<el-table-column prop="task_url" label="任务地址名称" />
				<el-table-column
					prop="finish_task_url"
					label="任务完成地址(后端接口)"
				/>
				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								v-model="TAddress.search"
								style="width: 75%"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="TAddress.changeTaskList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click="TAddress.changeTaskList(ruleFormRef, true, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click="TAddress.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="TAddress.dialogFormVisible"
			:title="
				TAddress.isChangeTaskAddress
					? '修改' + TAddress.changeForm.url_name
					: '添加任务地址'
			"
			:before-close="TAddress.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="TAddress.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="url_name" label="任务地址名称">
					<el-input
						clearable
						v-model="TAddress.form.url_name"
						autocomplete="off"
						placeholder="请输入任务地址名称"
					/>
				</el-form-item>
				<el-form-item prop="task_url" label="任务跳转地址">
					<el-input
						clearable
						v-model="TAddress.form.task_url"
						autocomplete="off"
						placeholder="请输入任务跳转地址(前端地址)"
					/>
				</el-form-item>
				<el-form-item prop="finish_task_url" label="任务完成地址">
					<el-input
						clearable
						v-model="TAddress.form.finish_task_url"
						autocomplete="off"
						placeholder="请输入任务完成地址(后端接口)"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="TAddress.handleClose">取消</el-button>
					<el-button
						type="primary"
						@click.stop="TAddress.onSubmit(ruleFormRef)"
					>
						提交
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.tableText {
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	word-break: break-all;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}
</style>
<route lang="yaml">
meta:
  layout: main
  name: 任务地址管理
</route>
