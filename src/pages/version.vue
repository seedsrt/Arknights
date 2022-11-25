<script setup lang="ts">
import dayjs from 'dayjs'
import type {
	FormInstance,
	FormRules,
	UploadFile,
	UploadProps,
} from 'element-plus'
const Version = createVersion()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	title: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
	content: [{ required: true, message: '请输入更新内容', trigger: 'blur' }],
	version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
	min_version: [
		{ required: true, message: '请输入最低版本号', trigger: 'blur' },
	],
})
const filterTableInforData = computed(() =>
	Version.versionList.filter(
		(data: any) =>
			!Version.search ||
			data.role_name.toLowerCase().includes(Version.search.toLowerCase())
	)
)
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`至多只能上传一个文件`)
}

const handleRemove = (file: UploadFile) => {
	Version.fileList = []
	console.log(file)
}
const handlePictureCardPreview = (file: UploadFile) => {
	Version.dialogImageUrl = file.url!
	Version.dialogVisible = true
}
onMounted(() => {
	Version.getVersionList()
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
				<el-table-column sortable prop="title" label="版本名称" />
				<el-table-column prop="content" label="更新内容" />
				<el-table-column prop="version" label="版本号" />
				<el-table-column prop="created_at" label="上传时间" width="200">
					<template #default="scope">
						<span>
							{{ dayjs(scope.row.created_at).format('YYYY-MM-DD HH:mm:ss') }}
						</span>
					</template>
				</el-table-column>
				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								style="width: 75%"
								v-model="Version.search"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="Version.changeVersionList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button type="danger" @click.stop="Version.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="Version.dialogFormVisible"
			title="添加版本"
			:before-close="Version.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="Version.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="title" label="版本名称">
					<el-input
						clearable
						v-model="Version.form.title"
						autocomplete="off"
						placeholder="请输入版本名称"
					/>
				</el-form-item>
				<el-form-item prop="content" label="更新内容">
					<el-input
						clearable
						v-model="Version.form.content"
						autocomplete="off"
						placeholder="请输入更新内容"
					/>
				</el-form-item>
				<el-form-item prop="version" label="版本号">
					<el-input
						clearable
						v-model="Version.form.version"
						autocomplete="off"
						placeholder="请输入版本号"
					/>
				</el-form-item>
				<el-form-item prop="min_version" label="最低版本号">
					<el-input
						clearable
						v-model="Version.form.min_version"
						autocomplete="off"
						placeholder="请输入最低版本号"
					/>
				</el-form-item>
				<el-form-item prop="is_update" label="是否强制更新">
					<el-switch v-model="Version.form.is_update" />
				</el-form-item>
				<el-form-item label="上传附件">
					<el-upload
						class="avatar-uploader"
						action="#"
						v-model:file-list="Version.fileList"
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
					<el-dialog v-model="Version.dialogVisible">
						<img w-full :src="Version.dialogImageUrl" alt="Preview Image" />
					</el-dialog>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="Version.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="Version.onSubmit(ruleFormRef)"
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
  name: 版本管理
</route>
