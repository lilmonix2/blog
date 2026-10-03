# Docker 发布、验收与回滚

使用 Node 22、Docker Desktop、Docker Buildx 与 Docker Compose v2.24+。本地公开配置从 `.env.example` 复制到 `.env.local`，SSH 参数从 `.env.deploy.example` 复制到 `.env.deploy`。当前生产服务器为 `81.70.213.236`。

`NEXT_PUBLIC_*` 和 `BASE_PATH` 在构建时确定，修改后必须重新构建。`.env.local` 通过 BuildKit secret 在本机挂载；原始环境文件不会复制进镜像或上传到服务器。公开值会进入客户端，不能存放密钥。

本机部署前安装依赖并运行检查：

```bash
npm ci
npm run check
```

Docker 使用 standalone server，主机只暴露 `127.0.0.1:3000`。`npm run dev` 用于开发；`npm run build` 后用 `npm start` 或 `PORT=3030 npm run serve` 本地预览生产版本。

## 远端发布

```bash
npm run deploy
```

部署命令在本机使用 Docker Buildx 构建 `linux/amd64` 镜像，然后通过 SSH 上传镜像归档、Compose 文件和重启脚本。`.env.local` 只作为 BuildKit secret 在本机挂载，不上传。默认镜像标签为提交 SHA + 时间戳。服务器在发布前标记现有镜像为 `ixjs-blog:rollback`，等待容器健康检查通过，再验收页面、搜索、RSS、sitemap、原图及非法路由；验收失败会尝试恢复前一镜像。单实例重建会有短暂中断。

仅在需要通过公开域名验收时，才在 `.env.deploy` 设置 `PUBLIC_SMOKE_URL=https://ixjs.com`。首次发布尚无前一镜像时，失败需要人工处理；Compose 与运行时配置的变更需要单独恢复。

手动回滚：

```bash
cd /opt/docker-services/blog
BLOG_IMAGE=ixjs-blog:rollback docker compose up -d --no-build --force-recreate --wait --wait-timeout 150
docker compose exec -T blog node scripts/smoke.mjs
```

## 修复点击大图时原图 404

2026-10-03 源站 Nginx 原来将 `/static/` 指向旧目录 `/home/wwwroot/blog/public/static/`；该目录没有文章图片，而 Docker 容器内的原图返回 200。现已将 Nginx 静态路由转发至 Next 服务，`nginx -t` 通过并重载；源站与公开域名的原图都已返回 200。原配置备份位于源站同目录的 `10-ixjs.com.conf.backup-时间戳`。

线上已完成修复，当前不需要手动改 Nginx。若以后再次出现 404，先用 `curl -I http://127.0.0.1:3000/static/images/the_type_of_reactive_variables_in_vue/img_2.png` 验证容器，再检查 `/usr/local/nginx/conf/vhost/10-ixjs.com.conf` 中 `/static/` location。当前静态请求代理到 Next 容器，配置备份保存在同目录的 `10-ixjs.com.conf.backup-时间戳`。
