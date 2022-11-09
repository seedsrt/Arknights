<template>
	<div class="asideLeft-template">
		<transition>
			<div v-if="!asider.isCollapse" class="top-logo">星火后台管理</div>
			<div v-else class="top-img">
				<img src="/public/logo.png" alt="" />
			</div>
		</transition>
		<div>
			<el-menu
				background-color="#191a23"
				text-color="rgba(170, 166, 157,.8)"
				active-text-color="#ffffff"
				style="height: calc(100vh - 60px)"
				:default-active="asider.asideActive"
				class="el-menu-vertical-demo"
				:collapse="asider.isCollapse"
				@select="asider.menuClick"
			>
				<el-menu-item index="/">
					<i class="mr-10px iconfont icon-zhuye1"></i>
					<template #title>主页</template>
				</el-menu-item>
				<el-sub-menu index="产品管理">
					<template #title>
						<i class="mr-10px iconfont icon-chanpin"></i>
						<span>产品管理</span>
					</template>
					<el-menu-item-group>
						<el-menu-item index="/productClassification"
							>产品分类管理</el-menu-item
						>
						<el-menu-item index="/productInformation"
							>产品信息管理</el-menu-item
						>
					</el-menu-item-group>
				</el-sub-menu>
			</el-menu>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'asider',
})
const asider = createAside()
</script>

<style lang="scss">
.asideLeft-template {
	display: flex;
	flex-direction: column;
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 200px;
		min-height: 400px;
	}
	.top-logo {
		height: 60px;
		line-height: 60px;
		font-size: 16px;
		color: #fff;
		text-align: center;
		background-color: #191a23;
		position: relative;
		transition: all 0.2s;
	}
	.top-img {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 64px;
		height: 60px;
		overflow: hidden;
		background-color: #191a23;
	}
	.el-sub-menu .el-menu {
		background-color: #111319;
	}
	.el-menu-item:hover {
		background-color: rgb(36 38 54);
	}
	.el-menu-item.is-active {
		background-color: #409eff;
	}
	.el-menu-item-group__title {
		display: none;
	}
}
</style>
