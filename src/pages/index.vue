<script setup lang="ts">
import dayjs from 'dayjs'
const TList = createTList()
const time = ref(new Date())
const aside = createAside()
let timer: any = null
onMounted(() => {
	TList.getTaskClassList()
	aside.asideActive = '/'
	aside.breadcrumb = ['/']
	aside.isCollapse = false
	aside.title = '主页'
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
	<el-card>
		<h1>欢迎使用</h1>
		当前时间为：{{ dayjs(time).format('YYYY-MM-DD HH:mm:ss') }}
	</el-card>
</template>

<style lang="scss"></style>

<route lang="yaml">
meta:
  layout: main
  name: 主页
</route>
