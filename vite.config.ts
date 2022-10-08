import { resolve } from 'path'
import Tov from './presets/tov'
import { defineConfig } from 'vite'
const Version = new Date().getTime() //为打包后的文件添加时间戳，防止浏览器缓存
export default defineConfig({
	base: './',
	resolve: {
		alias: {
			'~/': `${resolve(__dirname, 'src')}/`,
		},
	},
	plugins: [Tov()],
	build: {
		minify: 'esbuild',
		rollupOptions: {
			output: {
				// 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
				entryFileNames: `js/[name].[hash]${Version}.js`,
				// 用于命名代码拆分时创建的共享块的输出命名
				chunkFileNames: `js/[name].[hash]${Version}.js`,
				// 用于输出静态资源的命名，[ext]表示文件扩展名
				assetFileNames: `[ext]/[name].[hash]${Version}.[ext]`,
			},
		},
	},
	//跨域处理
	server: {
		proxy: {
			'/api': {
				target: '', //请求后端地址
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
})
