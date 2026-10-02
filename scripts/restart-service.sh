#!/usr/bin/env bash
set -Eeuo pipefail

image="${1:?需要提供待部署镜像名}"
[[ "$image" =~ ^[a-zA-Z0-9._/:@-]+$ ]] || { echo '无效镜像名' >&2; exit 1; }
previous="$(docker inspect --format '{{.Image}}' ixjs-blog 2>/dev/null || true)"
changed=false
if [[ -n "$previous" ]]; then docker image tag "$previous" ixjs-blog:rollback; fi
rollback() {
  local status=$?
  trap - ERR
  if [[ "$changed" == true && -n "$previous" ]]; then
    echo '验收失败，恢复上一版本...' >&2
    BLOG_IMAGE=ixjs-blog:rollback docker compose up -d --no-build --force-recreate --wait --wait-timeout 150 || echo '自动回滚失败，请立即检查 docker compose logs blog' >&2
  fi
  exit "$status"
}
trap rollback ERR
if [[ -f docker-image.tar.gz ]]; then
  gzip -dc docker-image.tar.gz | docker load
  rm -f docker-image.tar.gz
fi
export BLOG_IMAGE="$image"
changed=true
docker compose up -d --no-build --force-recreate --wait --wait-timeout 150
docker compose exec -T blog node scripts/smoke.mjs
if [[ -n "${PUBLIC_SMOKE_URL:-}" ]]; then docker compose exec -T blog node scripts/smoke.mjs "$PUBLIC_SMOKE_URL"; fi
printf '%s\n' "$image" > .deployed-image
docker compose ps
echo "部署与验收完成: $image"
