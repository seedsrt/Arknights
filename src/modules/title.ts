import { router } from './router'
//标题更改
const title: any = useTitle(import.meta.env.VITE_APP_TITLE)

router.beforeEach((r) => {
	const originTitle = import.meta.env.VITE_APP_TITLE
	console.log(r)
	if (r.path === '/') {
		title.value = `${originTitle} · home`
	} else {
		title.value = originTitle + r.path.replaceAll('/', ' · ')
	}
})
