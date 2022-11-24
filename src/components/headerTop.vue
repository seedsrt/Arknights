<script lang="ts" setup>
import { router } from '~/modules/router'
const asideTops = createAside()
const loadings = createLoading()
const changeAsides = () => {
	asideTops.isCollapse = !asideTops.isCollapse
}
const drawer2 = ref(false)
const drawer1 = ref(false)
</script>

<template>
	<div style="background-color: #191a23">
		<div class="header-template">
			<div class="header-logo">
				<div class="open-aside" @click="changeAsides">
					<i class="iconfont icon-zhankai"> </i>
				</div>
				<div class="open-aside" @click="router.go(0)">
					<i class="iconfont icon-shuaxin"> </i>
				</div>
			</div>
			<div class="header-rigth">
				<div class="open-aside" @click="drawer2 = true">
					<el-badge is-dot class="item">
						<i class="iconfont icon-tongzhi"> </i>
					</el-badge>
				</div>
				<div class="open-aside" @click="drawer1 = true">
					<el-badge is-dot class="item">
						<i class="iconfont icon-24gl-tags"> </i>
					</el-badge>
				</div>
				<div class="open-aside">
					<i class="iconfont icon-quanping"> </i>
				</div>
				<el-dropdown>
					<span class="el-dropdown-link">
						<div class="header-box">
							<div class="userHeader">
								<img src="/public/logo.png" alt="头像" />
							</div>
							<div class="userName">admin</div>
						</div>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item>个人信息</el-dropdown-item>
							<el-dropdown-item>修改密码</el-dropdown-item>
							<el-divider style="margin: 4px 0" />
							<el-dropdown-item @click="asideTops.loginOut"
								>退出登录</el-dropdown-item
							>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
	<el-drawer v-model="drawer1" direction="rtl">
		<template #header>
			<h4>本地标签</h4>
		</template>
		<template #default>
			<div>
				<el-empty description="暂无标签" />
			</div>
		</template>
	</el-drawer>
	<el-drawer v-model="drawer2" direction="rtl">
		<template #header>
			<h4>通知</h4>
		</template>
		<template #default>
			<div>
				<el-empty description="暂无通知" />
			</div>
		</template>
	</el-drawer>
</template>

<style lang="scss" scoped>
.header-template {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 60px;
	padding-right: 20px;
	.header-logo,
	.header-rigth {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.open-aside {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 60px;
		padding: 0 10px;
		box-sizing: border-box;
		cursor: pointer;
		transition: all 0.2s;
		border-top: 2px solid transparent;
		.iconfont {
			transform: translateY(-2px);
			color: #fff;
			font-size: 18px;
		}
	}
	.open-aside:hover {
		background-color: #111319;
		border-top: 2px solid #fff;
	}
	.header-box {
		display: flex;
		align-items: center;
		padding: 5px 20px;
		height: 60px;
		cursor: pointer;
		transition: all 0.2s;
		border-top: 2px solid transparent;
		.userHeader {
			display: block;
			width: 40px;
			height: 40px;
			border-radius: 40px;
			margin-right: 20px;
			border: 1px solid #f2f2f2;
			overflow: hidden;
			transform: translateY(-2px);
		}
		.userName {
			text-decoration: underline;
			color: #fff;
			transform: translateY(-2px);
		}
	}
	.header-box:hover {
		background-color: #111319;
		border-top: 2px solid #fff;
	}
}
</style>
