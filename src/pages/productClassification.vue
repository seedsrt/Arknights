<script setup lang="ts">
import type { UploadFile, UploadProps, UploadFiles } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
const PClass = createPclass()
const loading = createLoading()
const ruleFormRef1 = ref<FormInstance>()
const rules1 = reactive<FormRules>({
	name: [
		{
			required: true,
			message: '请填写产品类型',
			trigger: 'blur',
		},
	],
})
const ruleFormRef2 = ref<FormInstance>()
const rules2 = reactive<FormRules>({
	name: [
		{
			required: true,
			message: '请填写品牌类型',
			trigger: 'blur',
		},
	],
})

const filterTableData = computed(() =>
	PClass.productionClassList.filter(
		(data: any) =>
			!PClass.search ||
			data.title.toLowerCase().includes(PClass.search.toLowerCase())
	)
)
const filterTableDataDetail = computed(() =>
	PClass.productionBrandList.filter(
		(data: any) =>
			!PClass.searchDetail ||
			data.title.toLowerCase().includes(PClass.searchDetail.toLowerCase())
	)
)
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
	ElMessage.warning(`至多只能上传1张图片`)
}
const handleChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
	console.log(uploadFile, 'uploadFile')
	console.log(uploadFiles, 'uploadFiles')
}
const handleRemove = (file: UploadFile) => {
	PClass.fileList = []
	console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
	PClass.dialogImageUrl = file.url!
	PClass.dialogVisible = true
}

onMounted(() => {
	PClass.getPclassList()
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
				:row-style="{ cursor: 'pointer' }"
				@row-click="PClass.settingBrand"
			>
				<el-table-column sortable prop="title" label="类型" />
				<el-table-column
					sortable
					prop="created_at"
					label="创建时间"
					width="240"
				/>
				<el-table-column
					sortable
					prop="updated_at"
					label="更新时间"
					width="240"
				/>
				<el-table-column fixed="right" width="300">
					<template #header>
						<div style="display: flex; justify-content: space-between">
							<el-input
								v-model="PClass.search"
								style="width: 75%"
								clearable
								placeholder="搜索关键字"
							/>
							<el-button
								style="width: 20%"
								type="warning"
								@click.stop="PClass.settingProductionClass(ruleFormRef1, true)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click.stop="
								PClass.settingProductionClass(ruleFormRef1, false, scope.row)
							"
						>
							修改
						</el-button>
						<el-button
							type="danger"
							@click.stop="PClass.deleteProductionClass(scope.row)"
						>
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<!-- 产品类型表单 添加或修改 -->
		<el-dialog
			v-model="PClass.dialogFormVisible1"
			:title="
				PClass.isAdd1 ? '添加产品类型' : '修改' + PClass.settingItem1.title
			"
			:before-close="PClass.handleClose1"
		>
			<el-form
				style="padding-right: 20px"
				:model="PClass.form1"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules1"
				class="demo-ruleForm"
				ref="ruleFormRef1"
			>
				<el-form-item prop="name" label="产品类型名称" label-width="120px">
					<el-input
						placeholder="请填写产品类型"
						v-model="PClass.form1.name"
						autocomplete="off"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="PClass.handleClose1">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="PClass.sumProductionClass(ruleFormRef1)"
					>
						提交
					</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 品牌类型 添加或修改 -->
		<el-dialog
			v-model="PClass.dialogFormVisible2"
			:title="PClass.isAdd2 ? '添加品牌' : '修改' + PClass.settingItem2.title"
			:before-close="PClass.handleClose2"
		>
			<el-form
				style="padding-right: 20px"
				:model="PClass.form2"
				v-loading="loading.loading1"
				label-width="120px"
				:rules="rules2"
				class="demo-ruleForm"
				ref="ruleFormRef2"
			>
				<el-form-item prop="name" label="品牌类型名称" label-width="120px">
					<el-input
						placeholder="请填写品牌类型"
						v-model="PClass.form2.name"
						autocomplete="off"
					/>
				</el-form-item>
				<el-form-item label="上传图片" label-width="120px">
					<el-upload
						action="#"
						v-model:file-list="PClass.fileList"
						list-type="picture-card"
						:limit="1"
						:on-exceed="handleExceed"
						:auto-upload="false"
						:on-change="handleChange"
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
										v-if="!PClass.disabled"
										class="el-upload-list__item-delete"
										@click="handleRemove(file)"
									>
										<span> <i class="iconfont icon-shanchu"></i> </span>
									</span>
								</span>
							</div>
						</template>
					</el-upload>
					<el-dialog v-model="PClass.dialogVisible">
						<img w-full :src="PClass.dialogImageUrl" alt="Preview Image" />
					</el-dialog>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="PClass.handleClose2">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="PClass.sumProduction(ruleFormRef2)"
					>
						提交
					</el-button>
				</span>
			</template>
		</el-dialog>
		<!-- 点击详情 -->
		<el-dialog
			v-model="PClass.dialogFormVisibleDetail"
			:title="'编辑' + PClass.settingBrandName"
			width="70%"
			:before-close="PClass.handleCloseDetail"
		>
			<el-row v-loading="loading.loading1">
				<el-table
					table-layout="auto"
					size="large"
					:data="filterTableDataDetail"
					stripe
					style="width: auto"
					max-height="550px"
					fit
				>
					<el-table-column sortable prop="title" label="品牌" />
					<el-table-column
						sortable
						prop="created_at"
						label="创建时间"
						width="240"
					/>
					<el-table-column
						sortable
						prop="updated_at"
						label="更新时间"
						width="240"
					/>
					<el-table-column prop="img_url" label="品牌图" width="200">
						<template #default="scope">
							<div class="imageHover">
								<el-image
									:preview-teleported="true"
									style="
										display: flex;
										justify-content: center;
										align-items: center;
										height: 100px;
									"
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
								<!-- <span class="imageHover-actions">
								<i class="iconfont icon-sousuofangda"></i>
							</span> -->
							</div>
						</template>
					</el-table-column>
					<el-table-column fixed="right" width="300">
						<template #header>
							<div style="display: flex; justify-content: space-between">
								<el-input
									v-model="PClass.searchDetail"
									style="width: 75%"
									clearable
									placeholder="搜索关键字"
								/>
								<el-button
									style="width: 20%"
									type="warning"
									@click.stop="PClass.settingProduction(ruleFormRef2, true)"
									>添加</el-button
								>
							</div>
						</template>
						<template #default="scope">
							<el-button
								type="primary"
								@click.stop="
									PClass.settingProduction(ruleFormRef2, false, scope.row)
								"
							>
								修改
							</el-button>
							<el-button
								type="danger"
								@click.stop="PClass.deleteProduction(scope.row)"
							>
								删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="PClass.handleCloseDetail">取消</el-button>
					<el-button type="primary" @click.stop="PClass.handleCloseDetail">
						确认
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
</style>
<route lang="yaml">
meta:
  layout: main
  name: 产品分类管理
</route>
