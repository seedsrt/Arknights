<script setup lang="ts">
import type { FormInstance } from 'element-plus'
const login = createLogin()
const loading = createLoading()
const ruleFormRef = ref<FormInstance>()

const rules = reactive({
	name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
	console.log(login.form)
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			login.login()
			console.log('submit!')
		} else {
			console.log('error submit!')
			return false
		}
	})
}

const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.resetFields()
}

onMounted(() => {
	login.getCaptcha()
})
</script>

<template>
	<div class="login-template">
		<el-card v-loading="loading.loading" class="login-box">
			<h1 class="login-title">星火后台登录</h1>
			<el-form
				ref="ruleFormRef"
				:model="login.form"
				status-icon
				:rules="rules"
				label-width="80px"
				class="demo-ruleForm"
			>
				<el-form-item label="账号" prop="name">
					<el-input
						v-model="login.form.name"
						placeholder="请输入账号"
						clearable
					/>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input
						show-password
						v-model="login.form.password"
						type="password"
						placeholder="请输入密码"
						clearable
					/>
				</el-form-item>
				<el-form-item label="验证码" prop="captcha">
					<div
						style="
							width: 100%;
							display: flex;
							justify-content: space-around;
							align-items: center;
						"
					>
						<el-input
							style="width: 160px; margin-right: 10px"
							v-model="login.form.captcha"
							placeholder="请输入验证码"
							clearable
							@keyup.enter="submitForm(ruleFormRef)"
						>
						</el-input>
						<div class="captchaImg">
							<img
								style="cursor: pointer; width: 120px"
								:src="login.captchaImg"
								@click="login.getCaptcha"
								alt="验证码"
							/>
						</div>
					</div>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm(ruleFormRef)"
						>提交</el-button
					>
					<el-button @click="resetForm(ruleFormRef)">清除</el-button>
				</div>
			</el-form>
		</el-card>
	</div>
</template>

<style lang="scss">
.login-template {
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #273c75;
	.login-box {
		width: 450px;
		.demo-ruleForm {
			max-width: 100%;
			padding: 20px;
		}
		.login-title {
			width: 100%;
			text-align: center;
			font-weight: 600;
			margin-bottom: 20px;
		}
		.login-btn {
			display: flex;
			justify-content: center;
		}
		.captchaImg {
			display: flex;
			border-radius: 8px;
			overflow: hidden;
			height: 32px;
		}
	}
}
:root {
	--el-border-radius-base: 8px;
}
</style>

<route lang="yaml">
meta:
  layout: centerShow
  name: 登录
</route>
