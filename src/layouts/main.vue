<template>
	<div v-if="loading.isReloading" style="display: flex; height: 100vh">
		<div ref="asideWidth">
			<aside-left />
		</div>
		<div style="width: calc(100vw - 200px)">
			<!-- <div style="flex-direction: column; display: flex; height: 100vh"> -->
			<header-top />
			<headline />
			<div class="m-10px" style="flex: 1; overflow-y: scroll">
				<router-view />
			</div>
		</div>
		<!-- </div> -->
	</div>
</template>
<script lang="ts" setup>
const loading = createLoading()
const asideWidth = ref<HTMLElement | null>(null)
onMounted(() => {
	console.log((asideWidth.value as HTMLElement).clientWidth)
})
</script>
<style lang="scss" scoped></style>
