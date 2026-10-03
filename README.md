# lilmonix2's blog repository

fork from [timlrx/tailwind-nextjs-starter-blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)

Articles are prerendered from local MDX, with focused client components for search and reading interactions.

![lilmonix2-blog-icon](/public/static/images/logo.png)

Thanks for visiting my blog!

## Docker

本地开发使用 `npm run dev`。生产构建与运行统一使用 Docker：

```bash
docker compose up --build -d
docker compose logs -f blog
```

构建过程会以 BuildKit secret 读取 `.env.local`，该文件不会进入镜像层。容器只监听宿主机的 `127.0.0.1:3000`，供 Nginx 反向代理。

部署前在 `.env.deploy` 配置 `SERVER_HOST`、`SERVER_USER`、`SERVER_PORT` 和 `SERVER_DIR`，然后运行：

```bash
npm run deploy
```

部署脚本会构建 `linux/amd64` 镜像、上传到服务器，并通过 Docker Compose 重建 `ixjs-blog` 容器。

## 维护与验证

推荐 Node 26（`.nvmrc`）。首次安装使用 `npm ci`，`npm run dev` 开发，`npm run build` 构建，`npm start` / `npm run serve` 启动 standalone 生产预览，`PORT=3030 npm run serve` 指定端口。完整检查使用 `npm run check`，包含无修改 lint、分页/RSS 单元检查、生产构建、生成 HTML 校验和严格类型检查。`npm run lint:fix` 才会自动修改文件。

内容放在 `data/blog/*.mdx`，公开文章需要 title、ISO 日期、summary，tags 为字符串列表；draft 为 true 的文章不进入页面、RSS、搜索或 sitemap。作者引用必须存在，图片的站内路径必须在 `public/` 存在。layout 仅支持当前的 PostLayout。修改正文图片时请提供可理解的 alt 文本。搜索索引与 RSS 在构建时生成，标签直接从公开内容查询，无需手动更新 JSON。

发布细节、原图 404 排查与回滚请见 [Docker 发布指南](./faq/deploy-with-docker.md)。公开构建配置用 `.env.local`，SSH 参数用 `.env.deploy`，可选服务端运行配置用 `.env.runtime`。PR 和 main 分支自动运行验证，生产发布使用本机 Docker 镜像上传流程。
