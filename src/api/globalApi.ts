import { get, post, del } from './api'
// -------------------------------------------------------------------

// 产品列表
export function getGacha(token: string) {
	return get('/Arknights/gacha.php', { token: token })
}
