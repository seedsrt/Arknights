<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const User = createUser()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
	role: [{ required: true, message: '请输入用户角色', trigger: 'blur' }],
})
const filterTableInforData = computed(() =>
	User.userList.filter(
		(data: any) =>
			!User.search ||
			data.name.toLowerCase().includes(User.search.toLowerCase())
	)
)
onMounted(() => {
	User.getUserList()
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
				<el-table-column sortable prop="name" label="用户名称" />
				<el-table-column prop="role" label="角色" width="200">
					<template #default="scope">
						<span>
							{{
								User.roleList.find((item: any) => {
									return item.role == scope.row.role
								})?.role_name
							}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="last_login_ip" label="最近登录IP" width="160" />
				<el-table-column
					prop="last_login_time"
					label="最近登录时间"
					width="200"
				>
					<template #default="scope">
						<span>
							{{
								dayjs(scope.row.last_login_time).format('YYYY-MM-DD HH:mm:ss')
							}}
						</span>
					</template>
				</el-table-column>
				<el-table-column prop="score" label="贡献值" width="160">
					<template #default="scope">
						<el-tag v-if="scope.row.score == 0" class="ml-2" type="info">{{
							scope.row.score
						}}</el-tag>
						<el-tag
							v-else-if="scope.row.score > 0 && scope.row.score > 200"
							class="ml-2"
							type="success"
							>{{ scope.row.score }}</el-tag
						>
						<el-tag v-else class="ml-2" type="warning">{{
							scope.row.score
						}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								style="width: 75%"
								v-model="User.search"
								clearable
								placeholder="搜索关键字"
							/>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click="User.changeRoleList(ruleFormRef, scope.row)"
						>
							修改
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="User.dialogFormVisible"
			:title="'修改' + User.changeForm.name"
			:before-close="User.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="User.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="name" label="用户名称">
					<el-input
						clearable
						v-model="User.form.name"
						autocomplete="off"
						placeholder="请输入用户名称"
					/>
				</el-form-item>
				<el-form-item label="用户手机号">
					<el-input
						clearable
						v-model="User.form.phone"
						autocomplete="off"
						placeholder="请输入用户手机号"
					/>
				</el-form-item>
				<el-form-item label="用户邮箱">
					<el-input
						clearable
						v-model="User.form.email"
						autocomplete="off"
						placeholder="请输入用户邮箱"
					/>
				</el-form-item>
				<el-form-item label="用户密码">
					<el-input
						clearable
						v-model="User.form.password"
						autocomplete="off"
						placeholder="请输入用户密码"
					/>
				</el-form-item>
				<el-form-item label="用户贡献值">
					<el-input
						clearable
						v-model="User.form.score"
						autocomplete="off"
						placeholder="请输入用户贡献值"
					/>
				</el-form-item>
				<el-form-item prop="role" label="用户角色">
					<el-select placeholder="请选择用户角色" v-model="User.form.role">
						<el-option
							v-for="item in User.roleList"
							:key="item.role"
							:label="item.role_name"
							:value="item.role"
						/>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="User.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="User.onSubmit(ruleFormRef)"
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
  name: 用户管理
</route>
