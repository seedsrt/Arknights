import { resolve } from 'path'
import { env } from './shared/env'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Icons from 'unplugin-icons/vite'
import Inspect from 'vite-plugin-inspect'
import Markdown from './plugins/markdown'
import Windicss from 'vite-plugin-windicss'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ViteRestart from 'vite-plugin-restart'
import Layouts from 'vite-plugin-vue-layouts'
import I18n from '@intlify/vite-plugin-vue-i18n'
import { viteMockServe } from 'vite-plugin-mock'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import viteCompression from 'vite-plugin-compression'
import { markdownWrapperClasses } from './plugins/markdown'

import { DirResolverHelper } from 'vite-auto-import-resolvers'
import {
	ArcoResolver,
	NaiveUiResolver,
	AntDesignVueResolver,
	ElementPlusResolver,
	VueUseComponentsResolver
} from 'unplugin-vue-components/resolvers'
import Modules from 'vite-plugin-use-modules'
import { GenerateTitle } from './plugins/html'
import { FixLayoutsHmr } from './plugins/layouts'
import { AutoImportResolvers } from './shared/resolvers'

export default () => {
	return [
		Modules(),
		// 生成 title
		GenerateTitle(),
		// vue 官方插件，用来解析 sfc
		Vue({
			include: [/\.vue$/, /\.md$/]
		}),
		// markdown 编译插件
		Markdown(),
		// 文件路由
		Pages({
			extensions: ['vue', 'md', 'tsx']
		}),
		// 布局系统
		Layouts(),
		// 调试工具
		Inspect({
			enabled: env.VITE_APP_INSPECT
		}),
		// windicss 插件
		Windicss({
			safelist: markdownWrapperClasses
		}),
		// mock 服务
		viteMockServe({
			prodEnabled: env.VITE_APP_MOCK_IN_PRODUCTION
		}),
		// https://icones.netlify.app/
		Icons({
			autoInstall: true
		}),
		// 组件自动按需引入
		Components({
			extensions: ['vue', 'md', 'tsx'],
			include: [/\.md$/, /\.vue$/, /\.tsx$/],
			dts: resolve(__dirname, './types/components.d.ts'),
			resolvers: [
				ArcoResolver(),
				IconsResolver(),
				NaiveUiResolver(),
				ElementPlusResolver(),
				AntDesignVueResolver(),
				VueUseComponentsResolver()
			]
		}),
		// 目录下 api 按需自动引入辅助插件
		env.VITE_APP_API_AUTO_IMPORT &&
			env.VITE_APP_DIR_API_AUTO_IMPORT &&
			DirResolverHelper(),
		// api 自动按需引入
		env.VITE_APP_API_AUTO_IMPORT &&
			AutoImport({
				dts: './presets/types/auto-imports.d.ts',
				imports: [
					'vue',
					'pinia',
					'vue-i18n',
					'vue-router',
					'@vueuse/core'
				],
				resolvers: AutoImportResolvers
			}),
		// i18n 国际化支持
		I18n({
			runtimeOnly: true,
			compositionOnly: true,
			include: [resolve(__dirname, '../locales/**')]
		}),
		// 预设热重启服务
		ViteRestart({
			restart: [
				'.env*',
				'presets/tov.[jt]s',
				'presets/shared/**/*'
			]
		}),
		// tsx 支持
		vueJsx(),
		// 生产环境资源压缩
		viteCompression({
			// @ts-ignore
			algorithm: env.VITE_APP_COMPRESSINON_ALGORITHM
		}),
		// 对 vite-plugin-vue-layouts 的 hmr 问题的临时处理
		// 如果 https://github.com/JohnCampionJr/vite-plugin-vue-layouts/pull/58 被接受的话，未来可能会移除
		FixLayoutsHmr()
	]
}
