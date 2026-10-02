import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const script = fileURLToPath(new URL('../scripts/restart-service.sh', import.meta.url))
async function run(env = {}) {
  const directory = await mkdtemp(path.join(tmpdir(), 'blog-deploy-test-'))
  const log = path.join(directory, 'calls.log')
  await writeFile(
    path.join(directory, 'docker'),
    `#!/usr/bin/env bash
printf '%s|%s\\n' "\${BLOG_IMAGE:-}" "$*" >> "$MOCK_LOG"
if [[ "$1" == inspect ]]; then echo sha256:previous; exit 0; fi
if [[ "$*" == 'compose up '* && "\${BLOG_IMAGE:-}" != ixjs-blog:rollback && "\${FAIL_START:-}" == 1 ]]; then exit 1; fi
if [[ "$*" == 'compose exec '* && "\${FAIL_SMOKE:-}" == 1 ]]; then exit 1; fi
exit 0
`,
    { mode: 0o755 }
  )
  const result = spawnSync('bash', [script, 'custom-blog:revision'], {
    cwd: directory,
    env: { ...process.env, PATH: `${directory}:${process.env.PATH}`, MOCK_LOG: log, ...env },
    encoding: 'utf8',
  })
  const calls = await readFile(log, 'utf8')
  await rm(directory, { recursive: true, force: true })
  return { result, calls }
}

test('发布使用指定镜像，并等待健康检查和 HTTP 验收', async () => {
  const { result, calls } = await run()
  assert.equal(result.status, 0, result.stderr)
  assert.match(calls, /custom-blog:revision\|compose up .*--wait --wait-timeout 150/)
  assert.match(calls, /compose exec -T blog node scripts\/smoke.mjs/)
})

for (const failure of ['FAIL_START', 'FAIL_SMOKE']) {
  test(`${failure} 失败时恢复上一镜像并保留失败状态`, async () => {
    const { result, calls } = await run({ [failure]: '1' })
    assert.equal(result.status, 1)
    assert.match(calls, /image tag sha256:previous ixjs-blog:rollback/)
    assert.match(calls, /ixjs-blog:rollback\|compose up .*--wait/)
  })
}
