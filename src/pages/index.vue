<script setup lang="ts">
import dayjs from 'dayjs'
const TList = createTList()
const time = ref(new Date())
let timer: any = null
onMounted(() => {
	TList.getTaskClassList()
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
		当前时间为：{{ dayjs(time).format('YYYY-MM-DD HH:mm:ss') }}
		<div>
			<el-button @click.stop="TList.getTest"> 跨域测试 </el-button>
		</div>
	</el-card>
</template>

<style lang="scss"></style>

<route lang="yaml">
meta:
  layout: main
  name: 主页
</route>
