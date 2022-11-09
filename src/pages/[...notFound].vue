<script setup lang="ts"></script>

<template>
	<div class="notFound-page">
		<div class="card">
			<h1 class="title">404 Page Not Found</h1>
			<h2 class="little-title">您所访问的网址不存在</h2>
			<span class="reBack"><a href="/"> &lt; 返回主页</a></span>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.notFound-page {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #161b22;
	.card {
		display: flex;
		flex-direction: column;
		width: 75%;
		max-width: 364px;
		padding: 24px;
		background: white;
		color: rgb(14, 30, 37);
		border-radius: 8px;
		box-shadow: 0 2px 4px 0 rgb(14 30 37 / 16%);
		.title {
			font-size: 20px;
			font-weight: bold;
			text-align: center;
		}
		.reBack {
			color: #000;
			transition: all 0.2s;
		}
		.reBack:hover {
			color: cadetblue;
		}
	}
}
</style>

<route lang="yaml">
meta:
  layout: notFound
  name: notFound
</route>
