<script setup lang="ts">
const aside = createLoading()
onMounted(() => {
	aside.getData()
})
</script>

<template>
	<div class="logo-box">
		<div class="logo">LOGO</div>
		<div class="animate-wave"></div>
	</div>
</template>

<style lang="scss">
.logo-box {
	position: relative;
	width: 50px;
	height: 50px;
	.logo {
		text-align: center;
		line-height: 50px;
		border-radius: 50%;
		margin: 0 auto;
		z-index: 9;
	}

	.animate-wave {
		width: 60px;
		height: 60px;
		position: absolute;
		top: 0;
		left: 0;
		background: rgb(255, 216, 2);
		clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		animation: 1500ms ease-out 0s infinite normal none running start;
	}

	// @-webkit-keyframes opac {
	// 	from {
	// 		opacity: 1;
	// 		width: 0;
	// 		height: 0;
	// 		top: 50%;
	// 		left: 50%;
	// 	}

	// 	to {
	// 		opacity: 0;
	// 		width: 100%;
	// 		height: 100%;
	// 		top: 0;
	// 		left: 0;
	// 	}
	// }

	.animate-wave * {
		width: 100%;
		position: absolute;
		transform: rotate(45deg);
	}
}
</style>
