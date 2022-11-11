<template>
	<div
		v-if="loadings.isReloading"
		style="display: flex; height: 100vh; background-color: #f2f2f2"
	>
		<div ref="asideWidth">
			<aside-left />
		</div>
		<div style="flex: content">
			<header-top />
			<div
				style="
					box-sizing: border-box;
					position: relative;
					flex: 1 1 auto;
					height: calc(100vh - 60px - 10px);
					overflow-y: scroll;
					margin-left: 8px;
				"
			>
				<router-view />
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
const loadings = createLoading()
const aside = createAside()
</script>
<style lang="scss" scoped></style>
