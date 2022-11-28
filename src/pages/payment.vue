<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const Payment = createPayment()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	name: [{ required: true, message: '请输入收款方式', trigger: 'blur' }],
})
const filterTableInforData = computed(() =>
	Payment.paymentList.filter(
		(data: any) =>
			!Payment.search ||
			data.name.toLowerCase().includes(Payment.search.toLowerCase())
	)
)
onMounted(() => {
	Payment.getPaymentTypeList()
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
				<el-table-column sortable prop="name" label="收款方式" />
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
								v-model="Payment.search"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="Payment.changeRoleList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click="Payment.changeRoleList(ruleFormRef, true, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click="Payment.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="Payment.dialogFormVisible"
			:title="
				Payment.isChangePaymentList
					? '修改' + Payment.changeForm.name
					: '添加收款方式'
			"
			:before-close="Payment.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="Payment.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="name" label="收款方式">
					<el-input
						clearable
						v-model="Payment.form.name"
						autocomplete="off"
						placeholder="请输入收款方式"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="Payment.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="Payment.onSubmit(ruleFormRef)"
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
