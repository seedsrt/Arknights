<script setup lang="tsx">
const PClass = createPclass()
const loading = createLoading()

const search = ref('')

const deleteRow = (item: any) => {
	console.log(item)
}
const filterTableData = computed(() =>
	PClass.productionClassList.filter(
		(data: any) =>
			!search.value ||
			data.title.toLowerCase().includes(search.value.toLowerCase())
	)
)
const onAddItem = () => {
	console.log(PClass.productionClassList)
}
onMounted(() => {
	PClass.getPclassList()
})
</script>

<template>
	<el-card v-loading="loading.loading">
		<el-table
			table-layout="auto"
			size="large"
			:data="filterTableData"
			stripe
			style="width: auto"
			max-height="600px"
			fit
		>
			<el-table-column sortable prop="title" label="类型" width="200" />
			<el-table-column prop="img_url" label="产品图" />
			<el-table-column fixed="right" width="300">
				<template #header>
					<el-input v-model="search" placeholder="搜索" />
				</template>
				<template #default="scope">
					<el-button type="primary" @click.prevent="deleteRow(scope.row)">
						修改
					</el-button>
					<el-button type="danger" @click.prevent="deleteRow(scope.row)">
						删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-button class="mt-4" style="width: 100%" @click="onAddItem"
			>Add Item</el-button
		>
	</el-card>
</template>

<style lang="scss" scoped></style>
<route lang="yaml">
meta:
  layout: main
  name: 产品分类管理
</route>
