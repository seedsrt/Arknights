## ไฝฟ็จ ๐

> ่ฏฅๆจกๆฟไธ้ๅฎๅคงๅฎถไฝฟ็จๆไธ็นๅฎ็ๅ็ฎก็ๅจ๏ผnpm๏ผyarn ๅ pnpm ้ฝ่กใๅๆถๆณจๆ npm ็็ๆฌๅบ่ฏฅๅฐฝ้็ๆฐใ

ๅผบ็ๆจ่ๅคงๅฎถไฝฟ็จๆดๅฟซๆดๅ็็ `pnpm` ๅ็ฎก็ๅจ ๐ [ๅฎ่ฃๆ็จ](https://pnpm.io/zh/installation)

1. ๅฎ่ฃไพ่ต

```shell
pnpm install

# ๆ่ npm install
# ๆ่ yarn
```

2. ๅผๅ

```shell
pnpm dev

# ๆ่ npm run dev
# ๆ่ yarn dev

# ๅผๅฏ host
pnpm dev:host

# ๆ่ npm run dev:host
# ๆ่ yarn dev:host

# ่ชๅจๆๅผๆต่งๅจ
pnpm dev:open

# ๆ่ npm run dev:open
# ๆ่ yarn dev:open
```

3. ้ข่ง

```shell
pnpm preview

# ๆ่ npm run preview
# ๆ่ yarn preview

# ๅผๅฏ host
pnpm preview:host

# ๆ่ npm run preview:host
# ๆ่ yarn preview:host

# ่ชๅจๆๅผๆต่งๅจ
pnpm preview:open

# ๆ่ npm run preview:open
# ๆ่ yarn preview:open
```

4. ๆๅ

```shell
pnpm build

# ๆ่ npm run build
# ๆ่ yarn build
```

5. ๅๅๆต่ฏ

```shell
pnpm test

# ๆ่ npm run test
# ๆ่ yarn test
```

6. ๅๅๆต่ฏๆฅๅ็ๆ

```shell
pnpm coverage

# ๆ่ npm run coverage
# ๆ่ yarn coverage
```

7. ๆ ทๅผๆฅๅ้ข่ง

```shell
pnpm analysis

# ๆ่ npm run analysis
# ๆ่ yarn analysis
```

8. ๆ ทๅผๆฅๅๆๅ

```shell
pnpm analysis:build

# ๆ่ npm run analysis:build
# ๆ่ yarn analysis:build
```

9. ็ฑปๅๆฃๆฅ

```shell
pnpm typecheck

# ๆ่ npm run typecheck
# ๆ่ yarn typecheck
```

10. ่ชๅจๅๅปบ

```shell
pnpm auto:create

# ๆ่ npm run auto:create
# ๆ่ yarn auto:create
```

11. ่ชๅจ็งป้ค

```shell
pnpm auto:remove

# ๆ่ npm run auto:remove
# ๆ่ yarn auto:remove
```

12. ไพ่ตๆดๆฐ

```shell
# ๅฎๅจ็ๆฌๆดๆฐ
pnpm deps:fresh

# ๆ่ npm run deps:fresh
# ๆ่ yarn deps:fresh

# ไธป็ๆฌๆดๆฐ๏ผๅฏ่ฝๆฏ็ ดๅๆงๆดๆฐ๏ผ่ฐจๆไฝฟ็จ๏ผๅๅฅฝๆต่ฏ
pnpm deps:fresh:major

# ๆ่ npm run deps:fresh:major
# ๆ่ yarn deps:fresh:major

# ๆฌก็ๆฌๆดๆฐ๏ผๅฏ่ฝๆฏ็ ดๅๆงๆดๆฐ๏ผ่ฐจๆไฝฟ็จ๏ผๅๅฅฝๆต่ฏ
pnpm deps:fresh:minor

# ๆ่ npm run deps:fresh:minor
# ๆ่ yarn deps:fresh:minor

# ่กฅไธ็ๆฌๆดๆฐ
pnpm deps:fresh:patch

# ๆ่ npm run deps:fresh:patch
# ๆ่ yarn deps:fresh:patch
```

```shell
# ไปฅไธๅฝไปคไปๅฏนๅไฟกๆฏ package.json ่ฟ่กๅๅฅ๏ผ้่ฆ้ๆฐๆง่กๅๅฎ่ฃๅฝไปค
pnpm i

# ๆ่ npm i
# ๆ่ yarn
```

13. ไปฃ็ ่ง่ๆ ก้ช

```shell
pnpm lint

# ๆ่ npm run lint
# ๆ่ yarn lint

# ๆ ก้ชๆถไฟฎๅค

pnpm lint:fix

# ๆ่ npm run lint:fix
# ๆ่ yarn lint:fix
```