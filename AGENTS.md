# 开发约定

- 本目录是独立项目；在执行 Git 操作前检查仓库根目录，不改动上级目录或其他项目。
- 使用 React、TypeScript、Vite、npm 与官方 `@tailwindcss/vite` 集成；保留 `package-lock.json`，Node.js 使用 `.nvmrc` 中的受支持 LTS 主版本。
- 页面为中文，只展示 `src/data/sponsor.ts` 定义的一位赞助者。组件放在 `src/components`，数据放在 `src/data`，Hook 放在 `src/hooks`，样式放在 `src/styles`。
- 所有示例和占位素材必须清晰标注；不编造真实赞助金额、日期、荣誉、身份、活动或联系方式。联系方式只有经本人授权后才可公开。
- `public` 中的资源必须兼容 `import.meta.env.BASE_URL`；保持仓库部署路径 `/ldu-eta-sponsor/`。
- 欢迎页每次刷新展示 5 秒，计时器必须清理并兼容 StrictMode。尊重减少动画设置，维护键盘导航、语义结构、替代文本和对比度。
- 不引入数据库、付费 API、无必要的后端或大型 3D 引擎。
- 修改后运行 `npm run typecheck`、`npm run lint`、`npm run test`、`npm run build`；涉及交互或响应式行为时运行浏览器测试并检查控制台。
- 不覆盖未知用户文件。不自行发送消息、公开个人信息或声称已部署；远程仓库操作仅在明确授权范围内执行并验证结果。
