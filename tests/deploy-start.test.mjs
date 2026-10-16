import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

async function run(scenario) {
  const directory = await mkdtemp(path.join(tmpdir(), 'blog-docker-start-test-'))
  try {
    await mkdir(path.join(directory, 'scripts'))
    await copyFile(
      new URL('../scripts/deploy.sh', import.meta.url),
      path.join(directory, 'scripts/deploy.sh')
    )
    await writeFile(
      path.join(directory, '.env.deploy'),
      'SERVER_HOST=example.invalid\nIMAGE_NAME=blog:test\n'
    )
    await writeFile(
      path.join(directory, 'docker'),
      `#!/usr/bin/env bash
printf '%s\\n' "$*" >> "$MOCK_DIRECTORY/calls.log"
case "$1" in
  info)
    [[ "$MOCK_SCENARIO" == running || -f "$MOCK_DIRECTORY/ready" ]]
    ;;
  desktop)
    [[ "$MOCK_SCENARIO" != start-failed ]] || exit 1
    if [[ "$MOCK_SCENARIO" != unavailable ]]; then touch "$MOCK_DIRECTORY/ready"; fi
    ;;
  buildx)
    # Stop before any real build, upload, or remote deployment.
    exit 42
    ;;
  *) exit 99 ;;
esac
`,
      { mode: 0o755 }
    )
    const result = spawnSync('bash', ['scripts/deploy.sh'], {
      cwd: directory,
      env: {
        ...process.env,
        PATH: `${directory}:${process.env.PATH}`,
        MOCK_DIRECTORY: directory,
        MOCK_SCENARIO: scenario,
      },
      encoding: 'utf8',
      timeout: 5000,
    })
    return { result, calls: await readFile(path.join(directory, 'calls.log'), 'utf8') }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

test('Docker 已运行时直接构建，不启动 Desktop', async () => {
  const { result, calls } = await run('running')
  assert.equal(result.status, 42, result.stderr)
  assert.doesNotMatch(calls, /desktop/)
  assert.match(calls, /buildx build --platform linux\/amd64/)
})

test('Docker 未运行时自动启动，确认就绪后才构建', async () => {
  const { result, calls } = await run('stopped')
  assert.equal(result.status, 42, result.stderr)
  assert.match(calls, /^info\ndesktop start --timeout 120\ninfo\nbuildx build /)
})

for (const scenario of ['start-failed', 'unavailable']) {
  test(`Docker ${scenario} 时中止部署，不构建或上传`, async () => {
    const { result, calls } = await run(scenario)
    assert.equal(result.status, 1, result.stderr)
    assert.match(result.stderr, /错误: Docker Desktop/)
    assert.doesNotMatch(calls, /buildx|save/)
  })
}
