<script setup lang="ts">
import dayjs from 'dayjs'
import type {
	FormInstance,
	FormRules,
	UploadFile,
	UploadProps,
} from 'element-plus'
const reportAdmin = createReportAdmin()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	user_id: [{ required: true, message: '请选择用户名称', trigger: 'change' }],
	report_content: [
		{ required: true, message: '请输入报告内容', trigger: 'blur' },
	],
	title: [{ required: true, message: '请输入用户组名', trigger: 'blur' }],
})
const filterMethod = (query: any, item: any) => {
	return item.label.toLowerCase().includes(query.toLowerCase())
}
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`至多只能上传一个文件`)
}

const generateData = () => {
	const data = <any>[]
	const states = [
		'California',
		'Illinois',
		'Maryland',
		'Texas',
		'Florida',
		'Colorado',
		'Connecticut ',
	]
	states.forEach((city, index) => {
		data.push({
			label: city,
			key: index,
		})
	})
	return data
}

const data = ref<any[]>(generateData())

const handleRemove = (file: UploadFile) => {
	reportAdmin.fileList = []
	console.log(file)
}
const handlePictureCardPreview = (file: UploadFile) => {
	reportAdmin.dialogImageUrl = file.url!
	reportAdmin.dialogVisible = true
}
onMounted(() => {
	reportAdmin.getSummarysList()
	reportAdmin.getUserList()
})
</script>

<template>
	<div style="position: absolute; width: 100%">
		<el-card v-loading="loading.loading">
			<el-table
				ref="multipleTableRef"
				table-layout="auto"
				size="large"
				:data="reportAdmin.reportList"
				stripe
				style="width: auto"
				max-height="680px"
				fit
				lazy
			>
				<el-table-column sortable prop="title" label="用户组名" />
				<el-table-column prop="report_content" label="报告内容">
					<template #default="scope">
						<div class="tableText">
							{{ scope.row.report_content }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="上传时间" width="200">
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
								@input="reportAdmin.searchDetail"
								style="width: 75%"
								v-model="reportAdmin.search"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="reportAdmin.changeReportList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="warning"
							@click.stop="reportAdmin.sendReport(scope.row)"
						>
							发送
						</el-button>
						<el-button
							type="primary"
							@click.stop="
								reportAdmin.changeReportList(ruleFormRef, true, scope.row)
							"
						>
							修改
						</el-button>
						<el-button
							type="danger"
							@click.stop="reportAdmin.deleteRow(scope.row)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="demo-pagination-block">
				<el-pagination
					v-model:current-page="reportAdmin.params.offset"
					v-model:page-size="reportAdmin.params.limit"
					:page-sizes="[10, 20, 30, 40]"
					:background="true"
					layout="->, total, sizes, prev, pager, next, jumper"
					:total="reportAdmin.total"
					@size-change="reportAdmin.handleSizeChange"
					@current-change="reportAdmin.handleCurrentChange"
				/>
			</div>
		</el-card>
	</div>

	<el-dialog
		v-model="reportAdmin.dialogFormVisible"
		:title="
			reportAdmin.isChangeReportList
				? '修改' + reportAdmin.changeForm.title
				: '添加报告'
		"
		:before-close="reportAdmin.handleClose"
	>
		<el-form
			style="padding-right: 20px"
			:model="reportAdmin.form"
			v-loading="loading.loading1"
			label-width="120px"
			:rules="rules"
			class="demo-ruleForm"
			ref="ruleFormRef"
		>
			<el-form-item prop="title" label="用户组名">
				<el-input
					clearable
					v-model="reportAdmin.form.title"
					autocomplete="off"
					placeholder="请输入用户组名"
				/>
			</el-form-item>
			<el-form-item prop="user_id" label="用户">
				<!-- <el-transfer
					filterable
					:titles="['用户列表', '所选用户']"
					v-model="reportAdmin.form.user_id"
					:filter-method="filterMethod"
					filter-placeholder="搜索用户"
					:data="reportAdmin.userList"
				/> -->
				<el-select
					clearable
					collapse-tags
					collapse-tags-tooltip
					multiple
					v-model="reportAdmin.form.user_id"
					placeholder="选择用户"
				>
					<el-option-group
						v-for="group in reportAdmin.userList"
						:key="group.role"
						:label="group.roleName"
					>
						<el-option
							v-for="item in group.options"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						/>
					</el-option-group>
					<!-- <el-option
						v-for="item in reportAdmin.userList"
						:key="item"
						:label="item.name"
						:value="item.id"
					/> -->
				</el-select>
			</el-form-item>
			<el-form-item prop="report_content" label="报告内容">
				<el-input
					clearable
					v-model="reportAdmin.form.report_content"
					autocomplete="off"
					placeholder="请输入报告内容"
					type="textarea"
					:autosize="{ minRows: 4, maxRows: 6 }"
				/>
			</el-form-item>
			<el-form-item label="上传附件">
				<el-upload
					class="avatar-uploader"
					action="#"
					v-model:file-list="reportAdmin.fileList"
					:limit="1"
					:auto-upload="false"
					:on-exceed="handleExceed"
					list-type="text"
				>
					<el-button type="primary">点击上传</el-button>
					<template #tip>
						<div class="el-upload__tip">仅允许上传一个文件</div>
					</template>
				</el-upload>
				<el-dialog v-model="reportAdmin.dialogVisible">
					<img w-full :src="reportAdmin.dialogImageUrl" alt="Preview Image" />
				</el-dialog>
			</el-form-item>
			<div class="downLoadFile" v-if="reportAdmin.changeForm.img_url">
				<span class="p-6px"> 报告详情： </span>
				<a
					class="downLoadFile-a"
					:href="reportAdmin.changeForm.img_url"
					:download="reportAdmin.changeForm.name + '报告内容'"
					target="_blank"
				>
					<i class="iconfont icon-shiyongwendang"></i>
					{{ reportAdmin.changeForm.name }}报告附件
				</a>
			</div>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click.stop="reportAdmin.handleClose">取消</el-button>
				<el-button
					type="primary"
					:loading="loading.loading2"
					@click.stop="reportAdmin.onSubmit(ruleFormRef)"
				>
					提交
				</el-button>
			</span>
		</template>
	</el-dialog>
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
.downLoadFile {
	text-align: right;
	margin: 10px 0;
	.downLoadFile-a {
		padding: 6px;
		border-radius: 10px;
		transition: all 0.2s;
		text-decoration: underline;
	}
	.downLoadFile-a:hover {
		background-color: #f1f1f1;
		color: #409eff;
	}
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
  name: 管理员报告管理
</route>
