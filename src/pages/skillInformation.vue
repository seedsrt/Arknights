<script setup lang="ts">
import type { UploadFile, UploadProps } from 'element-plus'
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const skillInfor = createSkillInfor()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()
const disabledDate = (time: Date) => {
	return time.getTime() < Date.now()
}
const rules = reactive<FormRules>({
	skill_type: [
		{ required: true, message: '请选择技能类型', trigger: 'change' },
	],
	ptype: [{ required: true, message: '请选择产品类型', trigger: 'change' }],
	content: [{ required: true, message: '请填写技能信息内容', trigger: 'blur' }],
	status: [{ required: true, message: '是否审核', trigger: 'blur' }],
})
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`至多只能上传一个文件`)
}

const changeFile = (file: any, fileList: any) => {
	console.log('file', file, fileList)
	if (file.raw.type !== 'audio/mpeg') {
		ElMessage.error('只能上传mp3') //限制文件类型
		skillInfor.fileList = []
		return false
	} else {
		return true
	}
}
const handleRemove = (file: UploadFile) => {
	skillInfor.fileList = []
	console.log(file)
}
const handlePictureCardPreview = (file: UploadFile) => {
	skillInfor.dialogImageUrl = file.url!
	skillInfor.dialogVisible = true
}
onMounted(() => {
	skillInfor.getSkillInforList()
	skillInfor.getProList()
})
</script>

<template>
	<div style="position: absolute; width: 100%">
		<el-card v-loading="loading.loading">
			<el-table
				ref="multipleTableRef"
				table-layout="auto"
				size="large"
				:data="skillInfor.skillInforList"
				stripe
				style="width: auto"
				max-height="680px"
				fit
				lazy
			>
				<el-table-column sortable prop="name" label="产品名称" width="300" />
				<el-table-column prop="content" label="技能信息内容">
					<template #default="scope">
						<div class="tableText">
							{{ scope.row.content }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="skill_type" label="技能类型" width="120">
					<template #default="scope">
						<div>
							{{
								skillInfor.optionsSkill.find((item: any) => {
									return item.skill_type == scope.row.skill_type
								})?.skill_type_name
							}}
						</div>
					</template>
				</el-table-column>
				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								v-loading="loading.loading2"
								@input="skillInfor.searchDetail"
								v-model="skillInfor.search"
								style="width: 75%"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="skillInfor.changeSkillList(ruleFormRef, false)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click="skillInfor.changeSkillList(ruleFormRef, true, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click="skillInfor.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="demo-pagination-block">
				<el-pagination
					v-model:current-page="skillInfor.params.offset"
					v-model:page-size="skillInfor.params.limit"
					:page-sizes="[10, 20, 30, 40]"
					:background="true"
					layout="->, total, sizes, prev, pager, next, jumper"
					:total="skillInfor.total"
					@size-change="skillInfor.handleSizeChange"
					@current-change="skillInfor.handleCurrentChange"
				/>
			</div>
		</el-card>
		<el-dialog
			v-model="skillInfor.dialogFormVisible"
			:title="
				skillInfor.isChangeSkillInfor
					? '修改' + skillInfor.changeForm.name
					: '添加技能信息'
			"
			:before-close="skillInfor.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="skillInfor.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="skill_type" label="技能类型">
					<el-select
						v-model="skillInfor.form.skill_type"
						placeholder="请选择技能类型"
					>
						<el-option
							v-for="item in skillInfor.optionsSkill"
							:key="item.skill_type"
							:label="item.skill_type_name"
							:value="item.skill_type"
						/>
					</el-select>
				</el-form-item>
				<el-form-item prop="ptype" label="产品类型">
					<el-cascader
						placeholder="请选择产品类型"
						clearable
						v-model="skillInfor.form.ptype"
						:options="skillInfor.optionsProd"
						:props="{ expandTrigger: 'hover' }"
					/>
				</el-form-item>
				<el-form-item prop="content" label="技能描述">
					<el-input
						clearable
						type="textarea"
						v-model="skillInfor.form.content"
						autocomplete="off"
						placeholder="请输入技能描述"
						:autosize="{ minRows: 4, maxRows: 6 }"
					/>
				</el-form-item>
				<el-form-item prop="status" label="是否审核">
					<el-switch v-model="skillInfor.form.status" />
				</el-form-item>
				<el-form-item label="上传语音">
					<el-upload
						class="avatar-uploader"
						action="#"
						v-model:file-list="skillInfor.fileList"
						:limit="1"
						:auto-upload="false"
						:on-exceed="handleExceed"
						:on-change="changeFile"
						list-type="text"
						accept=".mp3"
					>
						<el-button type="primary">点击上传</el-button>
						<template #tip>
							<div class="el-upload__tip">仅允许上传一个文件，仅限mp3</div>
						</template>
					</el-upload>
					<el-dialog v-model="skillInfor.dialogVisible">
						<img w-full :src="skillInfor.dialogImageUrl" alt="Preview Image" />
					</el-dialog>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="skillInfor.handleClose">取消</el-button>
					<el-button
						type="primary"
						@click.stop="skillInfor.onSubmit(ruleFormRef)"
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
<style>
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
  name: 技能信息管理
</route>
