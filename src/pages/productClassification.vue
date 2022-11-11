<script setup lang="ts">
import type { UploadFile, UploadProps, UploadFiles } from 'element-plus'
const PClass = createPclass()
const loading = createLoading()
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
				max-height="600px"
				fit
				:row-style="{ cursor: 'pointer' }"
				@row-click="PClass.settingBrand"
			>
				<el-table-column sortable prop="title" label="类型" />
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
								@click.stop="PClass.onAddItem(0)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click.stop="PClass.settingRow(scope.row, 0)"
						>
							修改
						</el-button>
						<el-button type="danger" @click.stop="PClass.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog
			v-model="PClass.dialogFormVisible"
			:title="
				PClass.isAdd
					? PClass.isClass
						? '添加类型'
						: '添加品牌'
					: (PClass.isClass ? '修改类型' : '修改品牌') + PClass.settingForm.name
			"
			:before-close="PClass.handleClose"
		>
			<el-form
				style="padding-right: 20px"
				:model="PClass.form"
				v-loading="loading.loading1"
			>
				<el-form-item
					:rules="[
						{
							required: true,
							message: '请输入类型',
							trigger: 'blur',
						},
					]"
					label="类型名称"
					label-width="120px"
				>
					<el-input v-model="PClass.form.name" autocomplete="off" />
				</el-form-item>
				<div v-if="!PClass.isClass">
					<!-- <el-form-item label="品牌所属类型" label-width="120px">
						<el-select
							v-model="PClass.selectPid"
							clearable
							placeholder="Select"
						>
							<el-option
								v-for="item in PClass.productionClassList"
								:key="item.value"
								:label="item.title"
								:value="item.id"
							/>
						</el-select>
					</el-form-item> -->
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
				</div>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click.stop="PClass.handleClose">取消</el-button>
					<el-button
						type="primary"
						:loading="loading.loading2"
						@click.stop="
							PClass.isAdd ? PClass.createProduct() : PClass.updateProduct()
						"
					>
						提交
					</el-button>
				</span>
			</template>
		</el-dialog>
		<el-dialog
			v-model="PClass.dialogFormVisibleDetail"
			:title="'编辑' + PClass.settingBrandName"
			width="70%"
			:before-close="PClass.handleCloseDetail"
		>
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
				<el-table-column prop="img_url" label="品牌图" width="200">
					<template #default="scope">
						<el-image
							class="imageHover"
							:preview-teleported="true"
							style="width: 100px; height: 100px"
							:src="scope.row.img_url"
							:previewSrcList="[scope.row.img_url]"
							fit="fill"
						>
							<template #error>
								<div class="image-slot">
									<el-icon>
										<i class="iconfont icon-24gl-pictureSplit"></i>
									</el-icon>
								</div>
							</template>
						</el-image>
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
								@click.stop="PClass.onAddItem(-1)"
								>添加</el-button
							>
						</div>
					</template>
					<template #default="scope">
						<el-button
							type="primary"
							@click.stop="PClass.settingRow(scope.row, -1)"
						>
							修改
						</el-button>
						<el-button type="danger" @click.stop="PClass.deleteRow(scope.row)">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
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
