## 使用 🐂

> 该模板不限定大家使用某一特定的包管理器，npm，yarn 和 pnpm 都行。同时注意 npm 的版本应该尽量的新。

强烈推荐大家使用更快更合理的 `pnpm` 包管理器 👉 [安装教程](https://pnpm.io/zh/installation)

1. 安装依赖

```shell
pnpm install

# 或者 npm install
# 或者 yarn
```

2. 开发

```shell
pnpm dev

# 或者 npm run dev
# 或者 yarn dev

# 开启 host
pnpm dev:host

# 或者 npm run dev:host
# 或者 yarn dev:host

# 自动打开浏览器
pnpm dev:open

# 或者 npm run dev:open
# 或者 yarn dev:open
```

3. 预览

```shell
pnpm preview

# 或者 npm run preview
# 或者 yarn preview

# 开启 host
pnpm preview:host

# 或者 npm run preview:host
# 或者 yarn preview:host

# 自动打开浏览器
pnpm preview:open

# 或者 npm run preview:open
# 或者 yarn preview:open
```

4. 打包

```shell
pnpm build

# 或者 npm run build
# 或者 yarn build
```

5. 单元测试

```shell
pnpm test

# 或者 npm run test
# 或者 yarn test
```

6. 单元测试报告生成

```shell
pnpm coverage

# 或者 npm run coverage
# 或者 yarn coverage
```

7. 样式报告预览

```shell
pnpm analysis

# 或者 npm run analysis
# 或者 yarn analysis
```

8. 样式报告打包

```shell
pnpm analysis:build

# 或者 npm run analysis:build
# 或者 yarn analysis:build
```

9. 类型检查

```shell
pnpm typecheck

# 或者 npm run typecheck
# 或者 yarn typecheck
```

10. 自动创建

```shell
pnpm auto:create

# 或者 npm run auto:create
# 或者 yarn auto:create
```

11. 自动移除

```shell
pnpm auto:remove

# 或者 npm run auto:remove
# 或者 yarn auto:remove
```

12. 依赖更新

```shell
# 安全版本更新
pnpm deps:fresh

# 或者 npm run deps:fresh
# 或者 yarn deps:fresh

# 主版本更新，可能是破坏性更新，谨慎使用，做好测试
pnpm deps:fresh:major

# 或者 npm run deps:fresh:major
# 或者 yarn deps:fresh:major

# 次版本更新，可能是破坏性更新，谨慎使用，做好测试
pnpm deps:fresh:minor

# 或者 npm run deps:fresh:minor
# 或者 yarn deps:fresh:minor

# 补丁版本更新
pnpm deps:fresh:patch

# 或者 npm run deps:fresh:patch
# 或者 yarn deps:fresh:patch
```

```shell
# 以上命令仅对包信息 package.json 进行写入，需要重新执行包安装命令
pnpm i

# 或者 npm i
# 或者 yarn
```

13. 代码规范校验

```shell
pnpm lint

# 或者 npm run lint
# 或者 yarn lint

# 校验时修复

pnpm lint:fix

# 或者 npm run lint:fix
# 或者 yarn lint:fix
```