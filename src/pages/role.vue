<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const Role = createRole()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
})
const filterTableInforData = computed(() =>
	Role.roleList.filter(
		(data: any) =>
			!Role.search ||
			data.role_name.toLowerCase().includes(Role.search.toLowerCase())
	)
)
onMounted(() => {
	Role.getRoleList()
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
				<el-table-column sortable prop="role_name" label="角色名称" />
				<el-table-column prop="created_at" label="创建时间" width="200">
					<template #default="scope">
						<span>
							{{ dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="updated_at" label="更新时间" width="200">
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
								v-model="Role.search"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="Role.changeRoleList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click="Role.changeRoleList(ruleFormRef, true, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click="Role.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="Role.dialogFormVisible"
			:title="
				Role.isChangeRoleList ? '修改' + Role.changeForm.role_name : '添加角色'
			"
			:before-close="Role.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="Role.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="role_name" label="角色名称">
					<el-input
						clearable
						v-model="Role.form.role_name"
						autocomplete="off"
						placeholder="请输入角色名称"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="Role.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="Role.onSubmit(ruleFormRef)"
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
  name: 角色管理
</route>
