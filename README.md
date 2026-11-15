# 鲁东大学电子科技协会 · 赞助者专属网站

面向一位赞助者的中文静态网站，采用 React、TypeScript、Vite、Tailwind CSS 官方 Vite 插件、Motion for React 与 Lucide React。可免费部署到公开仓库的 GitHub Pages，无数据库、付费 API 或运行时后端。

当前内容是明确标注的演示占位资料，不代表真实的赞助、荣誉、活动记录或学校官方认证。正式发布前须替换并审核内容及素材授权。

## 本地开发

安装受支持的 Node.js 24 LTS（包含 npm），在项目根目录执行：

```powershell
npm ci
npm run dev
```

打开终端打印的地址，包含 `/ldu-eta-sponsor/` 子路径。每次刷新都会重新显示 5 秒欢迎页；不使用 Cookie 或浏览器存储跳过欢迎页。

```powershell
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
```

浏览器端测试：

```powershell
npx playwright install chromium
npm run build
npm run test:e2e
```

保留并提交 `package-lock.json`，CI 使用 `npm ci` 安装锁定的依赖。`.nvmrc` 指定 Node.js 24；使用 nvm 的开发者可运行 `nvm use`。如果 Windows 提示找不到 npm，请安装官方 Node.js LTS 并重新打开终端。

当前交付机器的 Node.js 可用，但 npm 未加入 PATH。项目临时目录保留了本次使用的 npm；在此机器上也可直接运行 `node work/package/bin/npm-cli.js run dev`。该临时工具不提交 Git，其他机器按上述标准方式安装 Node.js 与 npm。

本机浏览器测试使用已安装的 Microsoft Edge（Chromium 内核）。如果不下载 Playwright Chromium，可在 PowerShell 中运行：

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
npm run test:e2e
```

## 编辑赞助者信息

统一修改 `src/data/sponsor.ts`。网站只展示该对象对应的一位赞助者。

| 字段 | 用途 |
| --- | --- |
| `name`、`nickname`、`title` | 姓名、昵称与身份介绍 |
| `avatar`、`cover` | 人物头像与封面图 |
| `biography` | `string[]`；每个字符串是一段个人介绍 |
| `sponsorSince` | 经核实的赞助起始时间 |
| `contributions` | 经核实的贡献时间轴 |
| `honors` | 经核实且允许展示的荣誉 |
| `activities` | 获准公开的活动信息及图片 |
| `message` | 协会感谢寄语 |
| `contactLinks` | `{ label, url, authorized }[]`；仅 `authorized: true` 且链接协议有效时显示 |
| `isPlaceholder` | 示例标识；当前为 `true`，资料和图片全部核实替换后再改为 `false` |

按照文件中导出的 `Sponsor`、`Contribution`、`Honor`、`Activity`、`ContactLink` 类型编辑。`name` 是必填字符串；其余资料可省略，未知字符串留空，未知列表使用空数组。组件会隐藏相应内容或展示缺省提示。`biography` 必须使用字符串数组，不要改成单个字符串。不得用示例日期、金额、奖项替代未确认的事实。

联系方式当前为 `[]`。新增项需填写 `label`、`url`、`authorized`；只有本人明确授权后才能设为 `authorized: true`。页面只显示 `https:`、`mailto:`、`tel:` 链接，其他协议会被过滤。

保留 `isPlaceholder: true`，直到姓名、履历、贡献、活动、寄语和占位图片均完成核实及替换；否则页面会继续显示“示例档案”“活动示意”等说明。

## 替换本地图片

素材放在 `public/images/`，默认文件如下：

| 文件 | 用途 |
| --- | --- |
| `association-placeholder.svg` | 协会徽标，欢迎页、导航与网站图标引用 |
| `avatar-placeholder.svg` | 人物肖像占位图 |
| `cover-placeholder.svg` | 主视觉科技背景示意 |
| `activity-workshop.svg` | 电子实践活动插画 |
| `activity-project.svg` | 创意协作活动插画 |

以上均为占位或示意素材，不代表真实徽标、人物或活动；替换前确认肖像权和图片使用许可。头像、封面、活动图可以在 `src/data/sponsor.ts` 中更改文件名及图片说明。徽标路径在 `src/components/IntroScreen.tsx`、`src/components/Navbar.tsx` 和 `index.html` 中；使用真实徽标后，还需同步修改徽标替代文本及欢迎页“徽标占位图”标签。

数据中的资源路径以 `images/文件名` 的形式填写，交由 `src/data/assets.ts` 中的 `assetUrl()` 添加 `import.meta.env.BASE_URL`。不要硬编码 `/images/...` 或 `/public/images/...`。Vite 配置固定为：

```ts
base: '/ldu-eta-sponsor/'
```

这样构建后的图片、脚本和样式均可在 GitHub Pages 仓库子路径下加载。部署前使用 `npm run preview` 检查图片和控制台。

## GitHub Pages 部署

仓库名称必须为 `ldu-eta-sponsor`。本项目交付包含配置，未自动创建远程仓库、推送代码或上线。

1. 登录自己的 GitHub 账号，创建名称为 `ldu-eta-sponsor` 的**公开空仓库**，不要自动生成 README、许可证或 `.gitignore`。公开仓库可使用 GitHub Free 的 Pages。
2. 在本项目目录确认 Git 仓库根目录，确保输出是当前项目，避免提交上级目录中的其他项目：

   ```powershell
   git rev-parse --show-toplevel
   git status --short
   ```

3. 审阅需公开的文件，然后首次提交并推送；将 `YOUR_USERNAME` 替换为自己的 GitHub 用户名：

   ```powershell
   git add .
   git commit -m "feat: create sponsor website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ldu-eta-sponsor.git
   git push -u origin main
   ```

   按 GitHub 的认证流程完成登录。若已配置 `origin`，先用 `git remote -v` 检查它，再按实际情况调整地址，不要重复添加。

4. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
5. 在 **Actions** 页面打开“部署到 GitHub Pages”，必要时点击 **Run workflow**，选择 `main` 运行。
6. 等待 build 与 deploy 均成功，再访问 `https://YOUR_USERNAME.github.io/ldu-eta-sponsor/`。以后每次推送 `main` 都会自动构建部署，也支持手动触发。

工作流位于 `.github/workflows/deploy.yml`：使用 `npm ci`，执行类型检查、lint、单元测试与生产构建，将 `dist` 上传到官方 Pages artifact，由官方 `deploy-pages` 部署。构建任务仅有仓库只读权限；部署任务仅有 Pages 写入与 OIDC 权限。

官方参考：[Tailwind CSS 的 Vite 集成](https://tailwindcss.com/docs/installation/using-vite)、[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 无障碍与维护

- 欢迎页使用基于实际经过时间的 5 秒计时，并在卸载时清理计时器；React StrictMode 不会产生重复完成回调。
- 支持系统 `prefers-reduced-motion`：保留必要倒计时和页面切换，关闭强烈粒子、线路和位移动效。
- 导航、按钮、链接应可通过键盘操作，保留清晰的焦点样式和图片替代文本。
- 修改布局后检查桌面、窄屏和移动端菜单；修改数据后检查空值、空数组及未授权联系方式。
- 不添加分析追踪、数据库或后端依赖，除非另行确认需求。

`work/`、依赖、构建输出和测试报告均被 Git 忽略；不要把个人隐私、令牌或未授权资料放进公开仓库。

## 源码目录树

不展开 Git 元数据、node_modules、dist、work 和测试报告等自动生成目录。

```text
ldu-eta-sponsor/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── images/
│       ├── activity-project.svg
│       ├── activity-workshop.svg
│       ├── association-placeholder.svg
│       ├── avatar-placeholder.svg
│       └── cover-placeholder.svg
├── src/
│   ├── components/
│   │   ├── ActivityGallery.tsx
│   │   ├── ContributionTimeline.tsx
│   │   ├── Footer.tsx
│   │   ├── HonorGallery.tsx
│   │   ├── IntroScreen.tsx
│   │   ├── LocalImage.tsx
│   │   ├── Navbar.tsx
│   │   ├── Reveal.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── SponsorHero.tsx
│   │   ├── SponsorProfile.tsx
│   │   └── ThanksSection.tsx
│   ├── data/
│   │   ├── assets.ts
│   │   └── sponsor.ts
│   ├── hooks/
│   │   └── useIntroCountdown.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── intro.css
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── e2e/
│   │   └── site.spec.ts
│   ├── unit/
│   │   ├── assets.test.ts
│   │   ├── intro.test.tsx
│   │   └── page.test.tsx
│   └── setup.ts
├── .gitignore
├── .nvmrc
├── .oxlintrc.json
├── AGENTS.md
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── playwright.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

## 本次交付验证

- `npm ci` 成功，审计 129 个包，报告 0 个已知漏洞；保留锁文件。
- `npm run typecheck`、`npm run lint`、`npm run build` 均通过。
- `npm run test`：3 个文件，33 项测试通过。
- 浏览器测试：安装于本机的 Microsoft Edge / Chromium，4 项通过。覆盖入场时间、刷新重播、资源子路径、无控制台错误、320px/375px 布局、移动菜单、短横屏、减少动画与 Axe WCAG A/AA 自动扫描。
- 截图保存在未提交的 `work/screenshots/`，已进行视觉检查。自动扫描不等同于完整人工无障碍认证。
- 5 秒为计时截止点；正常模式随后淡出 350ms，减少动画模式直接切换。浏览器主线程繁忙时实际绘制可能稍晚，页面不会提前进入。
- 本地代码未提交、未配置远程、未推送，尚未在 GitHub Pages 线上验证。正式资料和素材仍需本人/协会核实与授权。
