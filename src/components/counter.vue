<script lang="ts" setup>
defineOptions({
	name: 'counter',
})

const counter = createCounter()
</script>

<template>
	<div>
		<div @click="counter.inc()">counter: {{ counter.count }}</div>
	</div>
</template>
