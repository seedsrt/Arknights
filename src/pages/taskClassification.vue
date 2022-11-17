<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const Tclass = createTclass()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
	task_type_name: [
		{ required: true, message: '请输入任务分类名称', trigger: 'blur' },
	],
})
// 搜索内容
const filterTableData = computed(() =>
	Tclass.TClassList.filter(
		(data: any) =>
			!Tclass.search ||
			data.task_type_name.toLowerCase().includes(Tclass.search.toLowerCase())
	)
)
onMounted(() => {
	Tclass.getTaskClassList()
})
</script>

<template>
	<div style="position: absolute; width: 100%">
		<el-card v-loading="loading.loading">
			<el-table
				table-layout="auto"
				size="large"
				:data="filterTableData"
				stripe
				style="width: auto"
				max-height="680px"
				fit
			>
				<el-table-column sortable prop="task_type_name" label="任务分类名称" />
				<el-table-column sortable label="创建时间">
					<template #default="scope">
						<span>
							{{ dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column sortable label="更新时间">
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
								v-model="Tclass.search"
								style="width: 75%"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="Tclass.changeTaskClass(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click.stop="Tclass.changeTaskClass(ruleFormRef, true, scope.row)"
						>
							修改
						</el-button>
						<el-button
							type="danger"
							@click.stop="Tclass.deleteTaskClass(scope.row)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="Tclass.dialogFormVisible"
			:title="
				Tclass.isChangeTaskClass
					? '修改' + Tclass.changeForm.task_type_name
					: '添加任务分类'
			"
			:before-close="Tclass.handleClosedialog"
		>
			<el-form
				:rules="rules"
				style="padding-right: 20px"
				:model="Tclass.form"
				v-loading="loading.loading1"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item
					prop="task_type_name"
					label="任务分类名称"
					label-width="120px"
				>
					<el-input
						v-model="Tclass.form.task_type_name"
						clearable
						autocomplete="off"
						placeholder="请输入任务分类名称"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="Tclass.handleClosedialog">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="Tclass.onSubmit(ruleFormRef)"
					>
						提交
					</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.image-slot {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--el-fill-color-light);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
	.iconfont {
		font-size: 20px;
	}
}
.iconfont {
	font-size: 20px;
}
</style>
<route lang="yaml">
meta:
  layout: main
  name: 任务分类管理
</route>
