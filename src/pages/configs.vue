<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const configs = createConfigs()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入配置项键名', trigger: 'blur' }],
	content: [{ required: true, message: '内容', trigger: 'blur' }],
	value: [{ required: true, message: '请输入配置项键值', trigger: 'blur' }],
})

onMounted(() => {
	configs.getConfigsList()
})
</script>

<template>
	<div style="position: absolute; width: 100%">
		<el-card v-loading="loading.loading">
			<el-table
				ref="multipleTableRef"
				table-layout="auto"
				size="large"
				:data="configs.configsList"
				stripe
				style="width: auto"
				max-height="680px"
				fit
				lazy
			>
				<el-table-column sortable prop="name" label="配置项键名" />
				<el-table-column prop="content" label="内容" />
				<el-table-column prop="value" label="配置项键值" />
				<el-table-column label="创建时间" width="200">
					<template #default="scope">
						<span>
							{{ dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column label="更新时间" width="200">
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
								v-loading="loading.loading2"
								@input="configs.searchDetail"
								style="width: 75%"
								v-model="configs.search"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="configs.changeTaskList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click.stop="configs.changeTaskList(ruleFormRef, true, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click.stop="configs.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="demo-pagination-block">
				<el-pagination
					v-model:current-page="configs.params.offset"
					v-model:page-size="configs.params.limit"
					:page-sizes="[10, 20, 30, 40]"
					:background="true"
					layout="->, total, sizes, prev, pager, next, jumper"
					:total="configs.total"
					@size-change="configs.handleSizeChange"
					@current-change="configs.handleCurrentChange"
				/>
			</div>
		</el-card>
		<el-dialog
			v-model="configs.dialogFormVisible"
			:title="
				configs.isChangeConfigsList
					? '修改' + configs.changeForm.name
					: '添加系统配置'
			"
			:before-close="configs.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="configs.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="name" label="配置项键名">
					<el-input
						clearable
						v-model="configs.form.name"
						autocomplete="off"
						placeholder="请输入配置项键名"
					/>
				</el-form-item>
				<el-form-item prop="content" label="更新内容">
					<el-input
						clearable
						v-model="configs.form.content"
						autocomplete="off"
						placeholder="请输入更新内容"
					/>
				</el-form-item>
				<el-form-item prop="value" label="配置项键值">
					<el-input
						clearable
						v-model="configs.form.value"
						autocomplete="off"
						placeholder="请输入配置项键值"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="configs.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="configs.onSubmit(ruleFormRef)"
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

.demo-pagination-block {
	margin: 10px 0;
}
.demo-pagination-block + .demo-pagination-block {
	margin-top: 10px;
}
.demo-pagination-block .demonstration {
	margin-bottom: 16px;
}
</style>
<route lang="yaml">
meta:
  layout: main
  name: 系统配置管理
</route>
