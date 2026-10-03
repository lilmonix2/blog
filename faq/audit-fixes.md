# 架构与阅读体验整改记录

日期：2026-10-03。按原审计的 24 项问题完成仓库内修改，保留并完善 Docker 部署方向。源站已切换至 `81.70.213.236`；Nginx 图片路由修复记录见下文。

| 原问题 | 实施结果 |
| --- | --- |
| 1. 分页重复 | 所有列表统一每页 6 篇；构建检查实际 HTML，13 篇文章为 6／6／1，无重复、无遗漏。 |
| 2. 非法和重复路由 | 严格解析页码，拒绝数字后缀、小数、前导零、越界；未知标签与文章返回 404；第 1 页永久跳转列表首页，分页独立 canonical。 |
| 3. 分享图失效 | 新增实际 PNG 分享图；统一 URL 生成、OG/Twitter/JSON-LD 图片；使用文章 canonicalUrl；sitemap 补充 about、标签和分页。 |
| 4. 安全版本 | Next、ESLint 配置和分析器同步到 15.5.27，React 与 React DOM 同步到 19.0.7。版本选择参照 [Next 维护更新](https://nextjs.org/blog/september-2026-security-release) 和 [React 发布列表](https://react.dev/versions)。 |
| 5. 标签 RSS | 使用同一公开文章规则、排序与标签查询；完整 XML 转义，支持空文章列表，等待写入完成，清理失效标签 feed。 |
| 6. 公开模板项目页 | 删除未使用 projects 路由、示例数据和卡片；/projects 现在返回 404。 |
| 7. 手机目录 | 正文前增加可收起的目录；大屏保留滚动侧栏；锚点导航后收起手机目录。 |
| 8. 暗色主题 | 设置可辨识的暗色链接和焦点颜色；演示组件补充深色背景、文字与状态；支持减少动画偏好。 |
| 9. 阅读宽度 | 去除正文重复容器；文章列表在 lg 才分栏，小屏标签流式排列；修复手机页脚换行。 |
| 10. 全文搜索 | 搜索标题、摘要、标签和正文，按需加载小型索引；增加加载、无结果、失败、超时和重试提示。 |
| 11. 键盘入口 | 原生按钮打开图片、复制代码；大图有名称、缩放、前后图片、Esc 退出及焦点恢复，重复图片按实例定位；图片补充响应式 sizes 和 23 个空 alt。 |
| 12. 导航与语义 | 中文导航和交互文案，当前页面高亮，首页 H1，正文跳过链接，44px 主要触控入口，主题选项选择后关闭菜单；修复 manifest 图标地址；按要求暂时隐藏 RSS 入口，保留 feed 文件生成。 |
| 13. 评论状态 | 按需加载 Giscus；中文状态、失败重试、15 秒超时、主题同步和 GitHub 讨论入口；区分无评论与真正服务错误。 |
| 14. 内容查询 | lib/content-core.mjs 共享纯规则，lib/content.ts 提供路由查询；始终过滤草稿、复制后排序、保留标签展示名称。 |
| 15. 客户端边界 | 列表与分页改为服务端组件，只传列表需要字段；图片上下文仅存在于文章；演示与评论延迟加载，PhotoProvider 保留 react-photo-view 并仅作用于文章，删除全局 KBar provider。 |
| 16. 图片资源 | 统一站内、远程与静态导入资源处理，公开构建时 BASE_PATH；保留 react-photo-view，大图首选高质量优化端点，失败提示提供重新打开入口；放大后可滚动查看。 |
| 17. 生命周期 | 目录仅追踪正文 TOC 标题，导航重新绑定并清理 scroll/resize/RAF；手机菜单使用 Headless UI 滚动与焦点管理；删除全局缩放手势拦截，清理演示和复制定时器。 |
| 18. 内容生成 | 删除受版本控制的 tag-data.json 派生副作用；搜索同步生成、RSS 可等待，生成失败直接使构建失败。 |
| 19. 类型和内容 | 开启 strict；布局枚举、公开摘要、作者引用、图片数组、图片存在性、日期和 canonical 校验。站点配置保留 JS 供 Node RSS 直接读取，以 @ts-check、satisfies 和 SiteConfig 类型约束。 |
| 20. 模板清理 | 删除未启用的 newsletter API、表单、旧列表/文章布局、重复 LayoutWrapper，以及未使用的 Algolia CSS、重复滚动锁依赖。 |
| 21. CSP 与 JSON-LD | 生产去除 unsafe-eval；限制 connect-src，补充 base-uri/object-src/frame-ancestors；JSON-LD 克隆后输出并转义 <。静态 Next 内联脚本仍需要 unsafe-inline。 |
| 22. 启动和部署 | deploy 显式用 Bash；Compose 接受统一镜像参数；dev 和 standalone start/serve 分开；Node 26 版本文件。 |
| 23. 健康与回滚 | SHA 镜像、串行发布，等待健康检查，HTTP 和原图验收，失败恢复旧镜像；分离公开构建配置、SSH 参数和运行变量。 |
| 24. CI 和验收 | 新增 PR 校验，main 发布先校验；lint 默认无修改，另有 lint:fix；添加 7 项内容/RSS/回滚测试与生成 HTML 校验；附本地 HTTP 冒烟脚本。 |

## 额外报告的原图 404

真实 Chrome 中确认：Vue 文章缩略图正常，大图对应 `/static/images/the_type_of_reactive_variables_in_vue/img_2.png` 失败。源站配置的 `location ^~ /static/` 将请求映射至旧目录 `/home/wwwroot/blog/public/static/`，而该文件不存在；当前 Docker 容器中的原图则返回 200。

已备份源站 Nginx 配置，将 `/static/` 与扩展名静态文件路由转发至 `127.0.0.1:3000`，`nginx -t` 通过并重载。源站原图及公开 `https://ixjs.com/static/images/the_type_of_reactive_variables_in_vue/img_2.png` 均返回 200。按要求保留 react-photo-view、拖动、触控和画廊功能，并将大图设为质量 100 的优化端点。

## 验证与边界

- npm run check 通过：无修改 lint、7 个测试、生产构建、严格类型检查和实际 HTML 检查。
- 本地 standalone HTTP 冒烟通过：页面、搜索、RSS、sitemap、原图和未知路由。
- 已在 390px 浏览器验证手机菜单、目录收起与锚点位置、搜索 netstat 命中正文、复制结果、主题菜单关闭、图片键盘打开/切换/Esc/焦点恢复。
- 临时反向代理模拟原图 404，优化端点可以加载大图；模拟搜索 503，显示失败和重试入口。
- YAML 解析、Bash 语法检查与 git diff --check 通过；回滚测试使用 mock Docker 验证失败路径。
- Docker Desktop 已在本机启动；部署使用本机构建的 `linux/amd64` 镜像归档上传至 `81.70.213.236`。容器健康检查和服务内部 HTTP 验收通过。关于页头像区的社交图标已按要求改为 Twitter 标志；本次更新未访问公开域名进行验收。
- 保留 Pliny 工具依赖；其部分旧依赖仍只声明 React 18 peer 范围，因此 npm 使用项目级兼容安装设置。已有生产构建及交互测试通过，未修改第三方包声明来隐藏差异。
- 构建报告首页 First Load JS 约 106kB、文章约 126kB；新增无障碍与交互能力有体积成本，尚无真实用户 LCP/INP 测量，不能宣称所有性能指标提升。
