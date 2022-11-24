<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormInstance, FormRules } from 'element-plus'
const report = createReport()
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
	report.reportList.filter(
		(data: any) =>
			!report.search ||
			data.name.toLowerCase().includes(report.search.toLowerCase())
	)
)
onMounted(() => {
	report.getUserList()
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
				:row-style="{ cursor: 'pointer' }"
				@row-click="report.gotoDetails"
			>
				<el-table-column sortable prop="name" label="用户名" />
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
								style="width: 75%"
								v-model="report.search"
								clearable
								placeholder="搜索关键字"
							/>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="demo-pagination-block">
				<el-pagination
					v-model:current-page="report.params.offset"
					v-model:page-size="report.params.limit"
					:page-sizes="[10, 20, 30, 40]"
					:background="true"
					layout="->, total, sizes, prev, pager, next, jumper"
					:total="report.total"
					@size-change="report.handleSizeChange"
					@current-change="report.handleCurrentChange"
				/>
			</div>
		</el-card>
	</div>
	<el-dialog
		v-model="report.dialogFormVisible"
		:title="report.details.name + '用户报告'"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
	>
		<el-descriptions :column="2" border direction="vertical">
			<el-descriptions-item label="用户名">{{
				report.details.name
			}}</el-descriptions-item>
			<el-descriptions-item label="用户电话">{{
				report.details.phone
			}}</el-descriptions-item>
			<el-descriptions-item label="上传时间">{{
				dayjs(report.details.created_at).format('YYYY-MM-DD HH:mm:ss')
			}}</el-descriptions-item>
			<el-descriptions-item label="更新时间">{{
				dayjs(report.details.updated_at).format('YYYY-MM-DD HH:mm:ss')
			}}</el-descriptions-item>
			<el-descriptions-item :span="2" label="报告内容">
				{{ report.details.report_content }}
			</el-descriptions-item>
		</el-descriptions>
		<div class="downLoadFile" v-if="report.details.img_url">
			<span class="p-6px"> 报告下载： </span>
			<a
				class="downLoadFile-a"
				:href="report.details.img_url"
				:download="report.details.name + '报告内容'"
				target="_blank"
			>
				<i class="iconfont icon-shiyongwendang"></i>
				{{ report.details.name }}报告附件
			</a>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click.stop="report.dialogFormVisible = false"
					>取消</el-button
				>
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
  name: 用户报告管理
</route>
