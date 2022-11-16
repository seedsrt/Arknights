<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const TList = createTList()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	task_name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
	task_type: [
		{
			required: true,
			message: '请选择任务类型',
			trigger: 'change',
		},
	],
	task_url: [{ required: true, message: '请输入任务地址', trigger: 'blur' }],
	finish_task_url: [
		{ required: true, message: '请输入完成地址', trigger: 'blur' },
	],
	add_score: [
		{ required: true, message: '请输入任务完成接口地址', trigger: 'blur' },
	],
	click_num: [
		{ required: true, message: '请输入需要点击次数(最小为1)', trigger: 'blur' },
	],
	start_time: [
		{
			required: true,
			message: '请输入任务开始时间 必须明天之后的时间戳',
			trigger: 'blur',
		},
	],
})
const filterTableInforData = computed(() =>
	TList.TList.filter(
		(data: any) =>
			!TList.search ||
			data.task_name.toLowerCase().includes(TList.search.toLowerCase())
	)
)
onMounted(() => {
	TList.getTaskList()
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
				<el-table-column sortable prop="task_name" label="任务名称" />
				<el-table-column prop="task_type" label="任务类型" width="240">
					<template #default="scope">
						<span>
							{{
								TList.taskClassList.find((item: any) => {
									return item.task_type == scope.row.task_type
								})?.task_type_name
							}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="start_time" label="开始时间" width="200">
					<template #default="scope">
						<span>
							{{
								dayjs(scope.row.start_time * 1000).format('YYYY-MM-DD HH:mm:ss')
							}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="end_time" label="结束时间" width="200">
					<template #default="scope">
						<span>
							{{
								scope.row.end_time === 0
									? '持续有效'
									: dayjs(scope.row.end_time * 1000).format(
											'YYYY-MM-DD HH:mm:ss'
									  )
							}}
						</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								style="width: 75%"
								v-model="TList.search"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="TList.changeTaskList(false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click="TList.changeTaskList(true, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click="TList.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="TList.dialogFormVisible"
			:title="
				TList.isChangeTaskList
					? '修改' + TList.changeForm.task_name
					: '添加任务分类'
			"
			:before-close="TList.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="TList.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="task_name" label="任务名称">
					<el-input
						clearable
						v-model="TList.form.task_name"
						autocomplete="off"
						placeholder="请输入任务名称"
					/>
				</el-form-item>
				<el-form-item prop="task_type" label="任务类型">
					<el-select
						placeholder="请选择任务类型"
						v-model="TList.form.task_type"
					>
						<el-option
							v-for="item in TList.taskClassList"
							:key="item.task_type"
							:label="item.task_type_name"
							:value="item.task_type"
						/>
					</el-select>
				</el-form-item>
				<el-form-item prop="task_url" label="任务地址">
					<el-select placeholder="请选择任务地址" v-model="TList.form.task_url">
						<el-option
							v-for="item in TList.taskAddressList"
							:key="item.taid"
							:label="item.url_name"
							:value="item.task_url"
						/>
					</el-select>
				</el-form-item>
				<el-form-item prop="finish_task_url" label="完成地址">
					<el-select
						placeholder="请选择完成地址"
						v-model="TList.form.finish_task_url"
					>
						<el-option
							v-for="item in TList.taskAddressList"
							:key="item.taid"
							:label="item.url_name"
							:value="item.finish_task_url"
						/>
					</el-select>
				</el-form-item>
				<el-form-item prop="add_score" label="新增贡献点">
					<el-input
						style="width: 200px"
						placeholder="请输入新增贡献点"
						clearable
						v-model="TList.form.add_score"
						autocomplete="off"
						type="number"
					/>
				</el-form-item>
				<el-form-item prop="click_num" label="需要点击次数">
					<el-input
						style="width: 200px"
						placeholder="请输入需要点击次数"
						clearable
						v-model="TList.form.click_num"
						autocomplete="off"
						type="number"
					/>
				</el-form-item>
				<el-form-item label="任务持续时间">
					<el-form-item prop="start_time">
						<el-date-picker
							v-model="TList.form.start_time"
							:disabled-date="disabledDate"
							type="datetime"
							label="开始时间"
							placeholder="请选择任务开始时间"
							autocomplete="off"
							style="width: 200px"
							value-format="x"
						/>
					</el-form-item>
					<span class="text-gray-500" style="margin: 0 20px">-</span>
					<el-form-item>
						<el-date-picker
							v-model="TList.form.end_time"
							:disabled-date="disabledDate"
							type="datetime"
							label="截止时间"
							placeholder="请选择截止时间"
							autocomplete="off"
							style="width: 200px"
							value-format="x"
						/>
					</el-form-item>
				</el-form-item>
				<el-form-item prop="sort" label="排序">
					<el-input
						style="width: 200px"
						clearable
						v-model="TList.form.sort"
						autocomplete="off"
						placeholder="请输入排序（值越大越靠前）"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="TList.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="TList.onSubmit"
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
