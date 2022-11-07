<script lang="ts" setup>
//根据唯一name进行定义pinina
defineOptions({
	name: 'counter',
})
//使用方法
const counter = createCounter()
</script>

<template>
	<div>
		<div @click="counter.inc()">counter: {{ counter.count }}</div>
	</div>
</template>
