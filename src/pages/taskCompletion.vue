<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const TCompletion = createTCompletion()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	task_finish_score_name: [
		{ required: true, message: '请输入任务完成度名称', trigger: 'blur' },
	],
	add_score: [{ required: true, message: '请输入新增贡献点', trigger: 'blur' }],
	need_finish_score: [
		{ required: true, message: '请输入需要完成度', trigger: 'blur' },
	],
})
const filterTableInforData = computed(() =>
	TCompletion.TCompletionList.filter(
		(data: any) =>
			!TCompletion.search ||
			data.task_finish_score_name
				.toLowerCase()
				.includes(TCompletion.search.toLowerCase())
	)
)
onMounted(() => {
	TCompletion.getTaskList()
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
				<el-table-column
					sortable
					prop="task_finish_score_name"
					label="任务完成度名称"
				/>
				<el-table-column prop="add_score" label="新增贡献点" />
				<el-table-column prop="need_finish_score" label="需要完成度" />
				<el-table-column label="创建时间">
					<template #default="scope">
						<span>
							{{ dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="更新时间">
					<template #default="scope">
						<span>
							{{ dayjs(scope.row.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								style="width: 75%"
								v-model="TCompletion.search"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="TCompletion.changeTaskList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click="TCompletion.changeTaskList(ruleFormRef, true, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click="TCompletion.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="TCompletion.dialogFormVisible"
			:title="
				TCompletion.isChangeTaskList
					? '修改' + TCompletion.changeForm.task_finish_score_name
					: '添加任务完成度'
			"
			:before-close="TCompletion.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="TCompletion.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="task_finish_score_name" label="完成度名称">
					<el-input
						clearable
						v-model="TCompletion.form.task_finish_score_name"
						autocomplete="off"
						placeholder="请输入完成度名称"
					/>
				</el-form-item>
				<el-form-item prop="add_score" label="新增贡献点">
					<el-input
						style="width: 200px"
						placeholder="请输入新增贡献点"
						clearable
						v-model="TCompletion.form.add_score"
						autocomplete="off"
						type="number"
					/>
				</el-form-item>
				<el-form-item prop="need_finish_score" label="需要完成度">
					<el-input
						style="width: 200px"
						placeholder="请输入需要完成度"
						clearable
						v-model="TCompletion.form.need_finish_score"
						autocomplete="off"
						type="number"
					/>
				</el-form-item>
				<el-form-item prop="sort" label="排序">
					<el-input
						style="width: 200px"
						clearable
						v-model="TCompletion.form.sort"
						autocomplete="off"
						placeholder="请输入排序(值越大越靠前)"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="TCompletion.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="TCompletion.onSubmit(ruleFormRef)"
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
  name: 任务列表管理
</route>
