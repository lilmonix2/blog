# Docker 发布、验收与回滚

使用 Node 22 与 Docker Compose v2.24+。本地公开配置从 `.env.example` 复制到 `.env.local`，SSH 参数从 `.env.deploy.example` 复制到 `.env.deploy`。`.env.runtime` 仅供服务端运行变量使用；当前博客不需要运行时密钥。

`NEXT_PUBLIC_*` 和 `BASE_PATH` 在构建时确定，修改后必须重新构建。`.env.local` 通过 BuildKit secret 挂载，只在构建期间读取；原始环境文件不复制进镜像。公开值会进入客户端，不能存放密钥。部署脚本不会上传 `.env.local`；旧文件里的 SSH 参数暂时仍兼容读取。

```bash
yarn install --immutable
yarn check
docker compose up --build -d --wait
docker compose logs -f blog
```

Docker 使用 standalone server，主机只暴露 `127.0.0.1:3000`。`yarn dev` 用于开发；`yarn build` 后用 `yarn start` 或 `PORT=3030 yarn serve` 本地预览生产版本。

## 远端发布

```bash
yarn deploy
```

脚本构建 `linux/amd64` 镜像，默认标签为提交 SHA + 时间戳。可通过 `IMAGE_NAME` 自定义完整镜像名，通过 `BLOG_IMAGE` 统一传递给 Compose。GitHub Actions 使用完整提交 SHA，并串行发布。每次发布前标记现有镜像为 `ixjs-blog:rollback`，等待容器健康检查通过，然后验收页面、搜索、RSS、sitemap、原图及非法路由。任何验收失败都会返回失败并尝试恢复前一镜像。单实例重建存在短暂中断。

可在 `.env.deploy` 设置 `PUBLIC_SMOKE_URL=https://ixjs.com`，额外通过外网验收 Nginx/CDN。CI 可在部署 SSH step 中设置同名变量。首次发布尚无前一镜像时，失败需要人工处理；Compose 与运行时配置的变更需要单独恢复。

手动回滚：

```bash
cd /opt/docker-services/blog
BLOG_IMAGE=ixjs-blog:rollback docker compose up -d --no-build --force-recreate --wait --wait-timeout 150
docker compose exec -T blog node scripts/smoke.mjs
```

## 修复点击大图时原图 404

2026-10-03 检查发现：`/_next/image` 缩略图正常，但 `/static/images/the_type_of_reactive_variables_in_vue/img_2.png` 返回 Nginx 404，Cloudflare 缓存响应为 `HIT`（`max-age=14400`）。仓库原图存在。说明问题位于 Nginx/部署静态资源链路，需要在生产服务器修正；不能仅凭缩略图加载成功判断图片发布正确。

Dockerfile 已复制完整 `public/`。在生产服务器先验证容器原图：

```bash
curl -I http://127.0.0.1:3000/static/images/the_type_of_reactive_variables_in_vue/img_2.png
```

若这里 200、域名仍 404，先绕过 Cloudflare 检查源站响应，排除旧 404 缓存；再检查 Nginx 的图片扩展名正则 `location` 或旧 `root`/`alias`。将 [deploy/nginx-blog.locations.conf](../deploy/nginx-blog.locations.conf) 的 `location ^~ /static/` 放进现有 ixjs.com 的 server block，替换重复的 `/static/` location。这会保留完整请求路径并代理给 Next，优先于旧图片正则。其余页面与 `/_next/` 也应代理到同一服务。子路径部署需对应调整为 `/notes/static/`，并让代理保留 `/notes`。

```bash
sudo nginx -t
sudo systemctl reload nginx
```

修复源站后，在 Cloudflare 控制台按 URL 清除已缓存的 404，再验证原图和点击大图。避免对 `/static/` 的 404 设置长缓存。前端保留 react-photo-view，大图使用高质量图片优化地址，并提供加载失败提示和重新打开入口；原图链路仍应修好。
