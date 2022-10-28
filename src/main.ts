import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
// 你自定义的 css
import './styles/main.css'
import 'virtual:windi-utilities.css'
import 'virtual:windi-devtools'
import { setGlobalOptions } from 'vue-request'
import App from './App.vue'

const app = createApp(App)

setGlobalOptions({
	// 防抖，时间内的请求只发一次
	debounceInterval: 300,

	// 节流，时间后发送请求
	throttleInterval: 10000,

	// 手动触发
	manual: true,
})

app.mount('#app')
