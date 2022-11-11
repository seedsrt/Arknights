<script setup lang="ts">
const { proxy } = getCurrentInstance() as any
const day = proxy.day
const time = ref(new Date())
let timer: any = null
onMounted(() => {
	timer = setInterval(() => {
		time.value = new Date()
	}, 1000)
})
onBeforeUnmount(() => {
	clearInterval(timer)
	timer = null
})
</script>

<template>
	<el-card class="w-250">
		<h1>欢迎使用</h1>
		当前时间为：{{ day(time).format('YYYY-MM-DD HH:mm:ss') }}
	</el-card>
</template>

<style lang="scss"></style>

<route lang="yaml">
meta:
  layout: main
  name: 主页
</route>
