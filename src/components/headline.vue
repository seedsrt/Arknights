<template>
	<div class="p-10px">
		<el-card>
			<div
				style="
					display: flex;
					justify-content: space-between;
					align-items: center;
				"
			>
				<div class="headline-title">{{ titles.title }}</div>
				<el-breadcrumb separator="/">
					<el-breadcrumb-item v-show="titles.breadcrumb[0] != '/'">
						{{ titles.breadcrumb[0] }}
					</el-breadcrumb-item>
					<el-breadcrumb-item>{{ titles.title }}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
		</el-card>
	</div>
</template>

<script lang="ts" setup>
const titles = createAside()
</script>

<style lang="scss">
.headline-title::before {
	content: '';
	border-radius: 4px;
	margin-right: 10px;
	border-left: 4px solid #409eff;
}
</style>
