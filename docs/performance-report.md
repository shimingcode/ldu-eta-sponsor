# 性能专项优化报告

日期：2026-11-15。基线提交：9c280c9。本报告记录发布前的本地测量；用户已于同日确认提交与部署。

## 测试条件与复现
Windows，Intel i5-1240P，Node 24.22.1，已安装的 Microsoft Edge Chromium 无头浏览器，375×812 CSS 像素、默认 DPR 1。生产构建通过 Vite preview 在 127.0.0.1:4173/ldu-eta-sponsor/ 提供。Chrome DevTools Protocol Performance 域与 PerformanceObserver 采集，4 倍 CPU 降速，不限制网络；每轮新浏览器上下文，禁用应用缓存复用，单次导航等待约 9 秒，顺序测量三轮，报告中位数。并非真实手机或公网体验，不提供 Lighthouse 评分。

复现：运行 npm ci、npm run build、npm run preview -- --host 127.0.0.1 --port 4173，然后 node docs/measure-performance.mjs after。基线需在独立检出 9c280c9 上构建并使用相同脚本。原始数据见 performance-before.json 和 performance-after.json。两组正式测量未同时运行端到端测试；宿主机其他负载未受控。

## 测量结果

| 指标（三轮中位数） | 优化前 | 优化后 |
|---|---:|---:|
| FCP（ms） | 488.0000 | 468.0000 |
| LCP（ms，当前视口） | 1236.0000 | 1220.0000 |
| 主页挂载（导航起点，ms） | 5564.5000 | 5528.0000 |
| CLS | 0.0006 | 0.0006 |
| 脚本执行累计（s） | 1.2693 | 0.6178 |
| 主线程任务累计（s） | 3.8639 | 3.3352 |
| rAF 平均频率（Hz，非 GPU 实际帧率） | 52.9013 | 51.8405 |
| 长任务次数 | 5.0000 | 5.0000 |
| 长任务累计（ms） | 613.0000 | 785.0000 |
| JS 堆采样（字节，未强制 GC） | 4705336.0000 | 3277720.0000 |
| INP | 未测量 | 未测量 |
| Lighthouse TBT | 未测量 | 未测量 |
| JS 初始/总体积（单入口，无动态分块） | 393.36 kB / 393.36 kB | 393.70 kB / 393.70 kB |
| JS gzip | 127.25 kB | 127.37 kB |
| CSS / gzip | 30.31 / 8.18 kB | 30.31 / 8.18 kB |
| 当前徽标文件 | 1,597,183 B | 977,428 B |

JS/CSS 为 Vite 构建输出，非公网实际压缩传输大小。未测量稳定交互 INP，不将菜单功能测试冒充 INP。未运行 Lighthouse，因此不以任意长任务统计冒充 TBT。

欢迎页从 React 挂载起计时 5000 ms；主页挂载从导航起点计算，包含脚本启动时间。LCP 在本手机视口主要反映欢迎内容，不能解释为赞助者主页加载完成。真实五秒回归观测约 5124 ms（包含浏览器调度与页面挂载），单元测试在4999ms不完成、5000ms仅完成一次。

脚本执行时间约减少51%，主线程任务时间下降约14%，但长任务累计和rAF频率并未改善。不能声称全面提速或动画帧率提升；三个样本不足以证明微小的FCP/LCP变化具有统计显著性。JS小幅增加是回调与DOM进度同步的成本，没有声称包体缩小。堆快照样本下降不代表不存在泄漏，长时间内存趋势与真实设备GPU帧率均未测量。

## 实际瓶颈与修改

1. useIntroCountdown 原先每帧 setProgress 使 IntroScreen 及30个粒子元素参与重复渲染。新增可选进度回调，由 ref 更新单个进度条 transform，aria进度仅整数变化时更新。React秒数仅变动时更新；保留单个rAF、绝对截止时间、StrictMode和后台暂停、清理机制。兼容原hook状态接口，测试验证800ms内进度回调超过40次、React仅初始渲染一次。
2. 透明徽标无损 WebP 减少38.8%资源字节。尺寸1254×1254不变，逐像素核对所有可见RGBA像素与透明通道完全一致。旧PNG保留，便于回退。欢迎页、导航和favicon复用统一路径。
3. LocalImage 对关键 eager 图片增加 fetchPriority=high；非首屏保留 lazy、async decoding。人物JPEG为79500 B，试验无损WebP为142388 B，因此未采用，未改变人物照片。

修改文件：src/hooks/useIntroCountdown.ts、src/components/IntroScreen.tsx、src/components/LocalImage.tsx、src/data/sponsor.ts（仅徽标路径）、vite.config.ts（仅favicon MIME）、public/images/association-logo-v2.webp、tests/unit/intro.test.tsx，以及本报告、测量脚本和原始JSON。

## 其他审计结论

App/SponsorPage静态小数据无昂贵排序、计算或逐帧props传递；未批量添加memo/useMemo/useCallback。Navbar监听仅菜单打开时注册，关闭及卸载清理。Reveal使用Motion可视区域触发且只执行一次，无自建滚动监听。粒子已使用transform/opacity，电路stroke动画可能有绘制成本，但没有隔离实验证明替换有收益，故保持。计时仅一个rAF和一个截止定时器，回调ref避免旧闭包，卸载均清理。

Lucide按名称导入，未发现全量命名空间图标导入；Motion与React为主要运行库，但当前无单独重型业务模块，不为理论包体收益拆分更多请求。未新增依赖。public历史图片不会因保留就自动被加载，未删除用户原素材。

徽标已有明确宽高；人物图CSS已有固定响应式高度，活动图片容器有aspect-ratio。实际CLS维持不变。全部资源继续使用BASE_URL，Vite base保持/ldu-eta-sponsor/。

## 图片清单（最终工作区）

| 文件 | 字节 |
|---|---:|
| activity-project.svg | 2693 |
| activity-workshop.svg | 2635 |
| association-logo-v2.png | 1597183 |
| association-logo-v2.webp | 977428 |
| association-logo.svg | 185119 |
| association-original.jpg | 138735 |
| association-placeholder.svg | 1496 |
| avatar-placeholder.svg | 3586 |
| cover-placeholder.svg | 1691 |
| ren-yixuan-portrait-v2.jpg | 79500 |
| ren-yixuan.png | 1102904 |
| share-cover.png | 335925 |

## 验收与待办

npm ci成功，审计0漏洞；优化前typecheck、lint、34项单测、build、9项端到端通过。优化后typecheck、lint、35项单测、build、9项端到端全部通过。同视口截图像素差异仅在导航徽标的35×35区域（编码格式解码/缩放差异），其他可见区域一致。端到端覆盖375、430、768、1366、1920px、短横屏、刷新重播、导航键盘操作、图片加载、Pages子路径、控制台错误及自动无障碍扫描。

未进行长期内存压力测试；不能保证绝无泄漏。现有计时器与监听器清理测试通过，没有发现新增泄漏路径。建议确认后小范围部署，并在真实移动网络和真实低端设备补测；部署结果以 GitHub Actions 和发布后的线上回归验证为准。
