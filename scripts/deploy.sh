#!/usr/bin/env bash
set -Eeuo pipefail
cd "$(dirname "$0")/.."

# .env.deploy contains SSH settings; legacy .env.local remains readable during migration.
if [[ -f .env.deploy ]]; then
  set -a; source .env.deploy; set +a
elif [[ -f .env.local ]]; then
  set -a; source .env.local; set +a
fi
: "${SERVER_HOST:?请在 .env.deploy 或环境变量设置 SERVER_HOST}"
: "${SERVER_USER:=root}"
: "${SERVER_PORT:=22}"
: "${SERVER_DIR:=/opt/docker-services/blog}"
: "${IMAGE_REPOSITORY:=ixjs-blog}"
[[ "$SERVER_DIR" =~ ^/[a-zA-Z0-9_./-]+$ ]] || { echo 'SERVER_DIR 必须是无空格的绝对路径' >&2; exit 1; }
[[ "$SERVER_PORT" =~ ^[0-9]+$ ]] || { echo '无效 SSH 端口' >&2; exit 1; }
: "${IMAGE_NAME:=$IMAGE_REPOSITORY:$(git rev-parse --short=12 HEAD)-$(date -u +%Y%m%d%H%M%S)}"
[[ "$IMAGE_NAME" =~ ^[a-zA-Z0-9._/:-]+$ ]] || { echo '无效镜像名' >&2; exit 1; }
command -v docker >/dev/null || { echo '错误: 本机未安装 Docker' >&2; exit 1; }
archive="$(mktemp -t ixjs-blog-image.XXXXXX)"
trap 'rm -f "$archive"' EXIT
build_args=(--platform linux/amd64 --tag "$IMAGE_NAME" --load)
if [[ -f .env.local ]]; then build_args+=(--secret id=env_local,src=.env.local); fi
docker buildx build "${build_args[@]}" .
docker save "$IMAGE_NAME" | gzip > "$archive"
remote="$SERVER_USER@$SERVER_HOST"
ssh -p "$SERVER_PORT" "$remote" "mkdir -p '$SERVER_DIR'"
scp -P "$SERVER_PORT" "$archive" "$remote:$SERVER_DIR/docker-image.tar.gz"
scp -P "$SERVER_PORT" compose.yaml "$remote:$SERVER_DIR/compose.yaml"
scp -P "$SERVER_PORT" scripts/restart-service.sh "$remote:$SERVER_DIR/restart-service.sh"
if [[ -f .env.runtime ]]; then
  scp -P "$SERVER_PORT" .env.runtime "$remote:$SERVER_DIR/.env.runtime.next"
  ssh -p "$SERVER_PORT" "$remote" "chmod 600 '$SERVER_DIR/.env.runtime.next' && mv '$SERVER_DIR/.env.runtime.next' '$SERVER_DIR/.env.runtime'"
fi
printf -v public_url '%q' "${PUBLIC_SMOKE_URL:-}"
ssh -p "$SERVER_PORT" "$remote" "cd '$SERVER_DIR' && PUBLIC_SMOKE_URL=$public_url bash ./restart-service.sh '$IMAGE_NAME'"
