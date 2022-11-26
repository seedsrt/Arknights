import { get, post, del } from './api'
// -------------------------------------------------------------------

// 登录
export function login(params: object) {
	return post('/admin/login', params)
}

// 登出
export function logout() {
	return post('/admin/logout')
}

// -------------------------------------------------------------------

// 创建产品类型
export function createProductTypes(params: object, data?: object) {
	return post('/admin/product/types/create', params, data)
}

// 产品类型列表
export function getProductTypesList() {
	return get('/admin/product/types/list')
}

// 产品类型详情
export function getProductTypesDetail(productTypesId: number | string) {
	return get('/admin/product/types/show/' + productTypesId)
}

// 修改产品类型
export function updateProductTypes(
	productTypesId: number | string,
	params: object,
	data?: object
) {
	return post('/admin/product/types/update/' + productTypesId, params, data)
}

// 删除产品类型
export function deleteProductTypes(productTypesId: number | string) {
	return del('/admin/product/types/del/' + productTypesId)
}

// -------------------------------------------------------------------

// 创建产品
export function createProduction(params: object, data: object) {
	return post('/admin/product/create', params, data)
}

// 产品列表
export function getProductionList(params: object) {
	return get('/admin/product/list', params)
}

// 产品详情
export function getProductionDetail(productTypesId: number | string) {
	return get('/admin/product/show/' + productTypesId)
}

// 修改产品
export function updateProduction(
	productTypesId: number | string,
	params: object,
	data: object
) {
	return post('/admin/product/update/' + productTypesId, params, data)
}

// 删除产品
export function deleteProduction(productTypesId: number | string) {
	return del('/admin/product/del/' + productTypesId)
}

// -------------------------------------------------------------------

// 计划任务
export function runTask() {
	return get('/admin/run_task')
}

// 任务分类列表
export function getTaskTypesList() {
	return get('/admin/task/get_tasktype')
}

// 添加任务分类
export function addTaskTypes(params: object) {
	return get('/admin/task/add_tasktype', params)
}

// 修改任务分类
export function updateTaskTypes(params: object) {
	return get('/admin/task/update_tasktype', params)
}

// 删除任务分类
export function deleteTaskTypes(params: object) {
	return get('/admin/task/del_tasktype', params)
}

// -------------------------------------------------------------------

// 任务地址列表
export function getTaskAddresses() {
	return get('/admin/task/get_addresses')
}

// 添加任务地址
export function addTaskAddresses(params: object) {
	return get('/admin/task/add_addresses', params)
}

// 修改任务地址
export function updateTaskAddresses(params: object) {
	return get('/admin/task/update_addresses', params)
}

// 删除任务地址
export function deleteTaskAddresses(params: object) {
	return get('/admin/task/del_addresses', params)
}

// -------------------------------------------------------------------

// 任务度列表
export function getFinishScore() {
	return get('/admin/task/get_finishscore')
}

// 任务完成度添加
export function addFinishScore(params: object) {
	return get('/admin/task/add_finishscore', params)
}

// 任务完成度修改
export function updateFinishScore(params: object) {
	return get('/admin/task/update_finishscore', params)
}

// 任务完成度删除
export function deleteFinishScore(params: object) {
	return get('/admin/task/del_finishscore', params)
}

// -------------------------------------------------------------------

// 任务列表
export function getTaskList() {
	return get('/admin/task/get_task')
}

// 任务列表添加
export function addTaskList(params: object) {
	return get('/admin/task/add_task', params)
}

// 任务列表修改
export function updateTaskList(params: object) {
	return get('/admin/task/update_task', params)
}

// 任务列表删除
export function deleteTaskList(params: object) {
	return get('/admin/task/del_task', params)
}

// -------------------------------------------------------------------

// 获取技能类型
export function getSkillsTypes() {
	return post('/api/skillType')
}

// 创建技能信息
export function createSkills(params: object, data: object) {
	return post('/admin/skills/create', params, data)
}

// 技能信息列表
export function getSkillsList(params: object) {
	return get('/admin/skills/list', params)
}

// 技能信息详情
export function getSkillsDetail(skillsId: number | string) {
	return get('/admin/skills/show/' + skillsId)
}

// 修改产品
export function updateSkills(
	skillsId: number | string,
	params: object,
	data: object
) {
	return post('/admin/skills/update/' + skillsId, params, data)
}

// 删除产品
export function deleteSkills(skillsId: number | string) {
	return del('/admin/skills/del/' + skillsId)
}

// -------------------------------------------------------------------

// 获取角色
export function getRoleList() {
	return get('/admin/role/get')
}

// 添加角色
export function addRole(params: object) {
	return get('/admin/role/add', params)
}

// 修改角色
export function updateRole(params: object) {
	return get('/admin/role/update', params)
}

// 删除角色
export function delRole(params: object) {
	return get('/admin/role/del', params)
}

// 查询用户
export function getUser() {
	return get('/admin/role/select_user')
}

// 修改用户资料
export function updateUser(params?: object) {
	return get('/admin/role/update_user', params)
}

// -------------------------------------------------------------------

// 报告列表
export function getReportList(params: object) {
	return get('/admin/report/list', params)
}

// -------------------------------------------------------------------

export function getSummarysList(params: object) {
	return get('/admin/summarys/list', params)
}

export function addSummarys(params: object, data: object) {
	return post('/admin/summarys/create', params, data)
}

export function updateSummarys(id: number, params: object, data: object) {
	return post('/admin/summarys/update/' + id, params, data)
}

export function delSummarys(id: number) {
	return del('/admin/summarys/del/' + id)
}

export function sendSummarysList(id: number) {
	return get('/admin/summarys/send', { id: id })
}

// -------------------------------------------------------------------

// 版本更新
export function getVersionList() {
	return get('/admin/version/get')
}

// 添加版本
export function addVersion(params: object, data: any) {
	return post('/admin/version/add', params, data)
}

// 删除版本
export function delVersionList(params: object) {
	return get('/admin/version/del', params)
}

// -------------------------------------------------------------------

// 创建配置信息
export function addConfigs(params: object) {
	return post('/admin/configs/create', params)
}

// 配置信息列表
export function getConfigsList(params: object) {
	return get('/admin/configs/list', params)
}

// 修改配置信息
export function updateConfigs(id: Number | String, params: object) {
	return post('/admin/configs/update/' + id, params)
}

// 创建配置信息
export function delConfigs(id: Number | String) {
	return del('/admin/configs/del/' + id)
}
