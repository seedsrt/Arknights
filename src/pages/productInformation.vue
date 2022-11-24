<script setup lang="ts">
import type { UploadFile, UploadProps, UploadFiles } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
const PInfor = createPinfor()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()

const removeDomain = (item: any) => {
	const index = PInfor.form.configuration_para.indexOf(item)
	if (index !== 0) {
		PInfor.form.configuration_para.splice(index, 1)
	}
}
const addDomain = () => {
	console.log(PInfor.form, 'form')
	PInfor.form.configuration_para.push({
		tit: '',
		price: '',
	})
}
const rules = reactive<FormRules>({
	title: [{ required: true, message: '请输入产品标题', trigger: 'blur' }],
	ptype: [{ required: true, message: '请选择产品所属品牌', trigger: 'change' }],
	configuration: [
		{ required: true, message: '请输入产品配置', trigger: 'blur' },
	],
	task_type_name: [
		{ required: true, message: '请输入产品标题', trigger: 'blur' },
	],
})
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`至多只能上传1张图片`)
}
const handleRemove = (file: UploadFile) => {
	PInfor.fileList = []
	console.log(file)
}
const handlePictureCardPreview = (file: UploadFile) => {
	PInfor.dialogImageUrl = file.url!
	PInfor.dialogVisible = true
}
onMounted(() => {
	PInfor.getPinforList()
	PInfor.getPclassList()
})
</script>

<template>
	<div style="position: absolute; width: 100%">
		<el-card v-loading="loading.loading">
			<el-table
				ref="multipleTableRef"
				table-layout="auto"
				size="large"
				:data="PInfor.productionTotList"
				stripe
				style="width: auto"
				max-height="680px"
				fit
				lazy
			>
				<el-table-column sortable prop="title" label="产品名称" />
				<el-table-column label="产品描述" width="240">
					<template #default="scope">
						<div class="tableText">
							{{ scope.row.details }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="price" label="产品价格">
					<template #default="scope">
						<el-tag type="success">
							￥{{ scope.row.sprice }}
							<span v-if="scope.row.eprice"> - ￥{{ scope.row.eprice }}</span>
							<span v-else>起</span>
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="img_url" label="产品图" width="200">
					<template #default="scope">
						<div class="imageHover">
							<el-image
								style="
									display: flex;
									justify-content: center;
									align-items: center;
									height: 100px;
								"
								:preview-teleported="true"
								:src="scope.row.img_url"
								:previewSrcList="[scope.row.img_url]"
								fit="contain"
							>
								<template #error>
									<div class="image-slot">
										<el-icon>
											<i class="iconfont icon-24gl-pictureSplit"></i>
										</el-icon>
									</div>
								</template>
							</el-image>
						</div>
					</template>
				</el-table-column>

				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								v-loading="loading.loading2"
								@input="PInfor.searchDetail"
								v-model="PInfor.search"
								style="width: 75%"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="PInfor.settingRow(ruleFormRef, true)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click.stop="PInfor.settingRow(ruleFormRef, false, scope.row)"
						>
							修改
						</el-button>
						<el-button type="danger" @click.stop="PInfor.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="demo-pagination-block">
				<el-pagination
					v-model:current-page="PInfor.params.offset"
					v-model:page-size="PInfor.params.limit"
					:page-sizes="[10, 20, 30, 40]"
					:background="true"
					layout="->, total, sizes, prev, pager, next, jumper"
					:total="PInfor.total"
					@size-change="PInfor.handleSizeChange"
					@current-change="PInfor.handleCurrentChange"
				/>
			</div>
		</el-card>
		<el-dialog
			v-model="PInfor.dialogFormVisible"
			:title="PInfor.isAdd ? '添加产品' : '修改' + PInfor.settingItem.title"
			:before-close="PInfor.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="PInfor.form"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules"
				class="demo-ruleForm"
				ref="ruleFormRef"
			>
				<el-form-item prop="title" label="产品标题">
					<el-input
						placeholder="请填写产品标题"
						clearable
						v-model="PInfor.form.title"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item prop="ptype" label="产品所属品牌">
					<el-cascader
						placeholder="请选择产品所属品牌"
						clearable
						v-model="PInfor.form.ptype"
						:options="PInfor.options"
						:props="{ expandTrigger: 'hover' }"
					/>
				</el-form-item>
				<el-form-item prop="configuration" label="产品配置">
					<el-input
						placeholder="请填写产品配置"
						clearable
						v-model="PInfor.form.configuration"
						autocomplete="off"
					/>
				</el-form-item>
				<div style="max-height: 120px; overflow-y: scroll">
					<el-form-item
						v-for="(domain, index) in PInfor.form.configuration_para"
						:key="index"
						:label="'配置' + (index + 1)"
						:prop="'configuration_para[' + index + '].tit'"
						:rules="{
							required: true,
							message: '请填写配置参数',
							trigger: 'blur',
						}"
					>
						<div style="display: flex">
							<el-input
								clearable
								autocomplete="off"
								v-model="domain.tit"
								style="width: 220px; margin-right: 10px"
								placeholder="请填写配置参数"
							/>
							<el-form-item
								:key="index"
								:prop="'configuration_para[' + index + '].price'"
								:rules="{
									required: true,
									message: '请填写配置价格',
									trigger: 'blur',
								}"
							>
								<el-input
									clearable
									autocomplete="off"
									v-model="domain.price"
									style="width: 140px"
									type="number"
									placeholder="请填写配置价格"
								/>
							</el-form-item>
							<el-button
								class="ml-2"
								type="danger"
								@click.prevent="removeDomain(domain)"
								>删除</el-button
							>
						</div>
					</el-form-item>
				</div>
				<el-button
					type="primary"
					@click="addDomain"
					class="m-5px ml-120px mb-18px"
					>添加配置</el-button
				>
				<!-- <div style="display: flex">
					<el-form-item prop="sprice" label="起始价格">
						<el-input
							style="width: 120px"
							placeholder="请填写起始价格"
							clearable
							v-model="PInfor.form.sprice"
							autocomplete="off"
						/>
					</el-form-item>
					<el-form-item prop="eprice" label="最高价格">
						<el-input
							style="width: 120px"
							placeholder="请填写最高价格"
							clearable
							v-model="PInfor.form.eprice"
							autocomplete="off"
						/>
					</el-form-item>
				</div> -->
				<el-form-item label="产品详情">
					<el-input
						placeholder="请填写产品详情"
						clearable
						v-model="PInfor.form.details"
						type="textarea"
						autocomplete="off"
						:autosize="{ minRows: 4, maxRows: 6 }"
					/>
				</el-form-item>
				<el-form-item label="上传图片">
					<el-upload
						class="avatar-uploader"
						action="#"
						v-model:file-list="PInfor.fileList"
						list-type="picture-card"
						:limit="1"
						:on-exceed="handleExceed"
						:auto-upload="false"
					>
						<span>
							<i style="font-size: 35px" class="iconfont icon-tianjia"></i>
						</span>

						<template #file="{ file }">
							<div>
								<img
									class="el-upload-list__item-thumbnail"
									:src="file.url"
									alt=""
								/>
								<span class="el-upload-list__item-actions">
									<span
										class="el-upload-list__item-preview"
										@click="handlePictureCardPreview(file)"
									>
										<span> <i class="iconfont icon-sousuofangda"></i> </span>
									</span>
									<span
										v-if="!PInfor.disabled"
										class="el-upload-list__item-delete"
										@click="handleRemove(file)"
									>
										<span> <i class="iconfont icon-shanchu"></i> </span>
									</span>
								</span>
							</div>
						</template>
					</el-upload>
					<el-dialog v-model="PInfor.dialogVisible">
						<img w-full :src="PInfor.dialogImageUrl" alt="Preview Image" />
					</el-dialog>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="PInfor.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="PInfor.sumitForm(ruleFormRef)"
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
.avatar-uploader .avatar {
	width: 100px;
	height: 100px;
	display: block;
}
.image-slot {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
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
// .imageHover-actions {
// 	position: absolute;
// 	width: 100%;
// 	height: 100%;
// 	left: 0;
// 	top: 0;
// 	cursor: default;
// 	display: inline-flex;
// 	justify-content: center;
// 	align-items: center;
// 	color: #fff;
// 	opacity: 0;
// 	font-size: 20px;
// 	background-color: var(--el-overlay-color-lighter);
// 	transition: opacity var(--el-transition-duration);
// }
</style>
<style>
.el-upload-list--picture-card {
	--el-upload-list-picture-card-size: 100px;
}
.el-upload--picture-card {
	--el-upload-picture-card-size: 100px;
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
  name: 产品信息管理
</route>
