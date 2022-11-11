import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
// 你自定义的 css
import './styles/main.css'
import 'virtual:windi-utilities.css'
import 'virtual:windi-devtools'
import App from './App.vue'
import * as dayjs from 'dayjs'

const app = createApp(App)
app.config.globalProperties.day = dayjs
app.mount('#app')
