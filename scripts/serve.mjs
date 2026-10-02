import { cp, mkdir, access } from 'node:fs/promises'
import { spawn } from 'node:child_process'

await access('.next/standalone/server.js').catch(() => {
  throw new Error('请先执行 yarn build 生成生产版本。')
})
await mkdir('.next/standalone/.next', { recursive: true })
await cp('.next/static', '.next/standalone/.next/static', { recursive: true })
await cp('public', '.next/standalone/public', { recursive: true })
const child = spawn(process.execPath, ['.next/standalone/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    HOSTNAME: process.env.HOSTNAME || '127.0.0.1',
    PORT: process.env.PORT || '3000',
  },
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal))
child.on('exit', (code) => process.exit(code ?? 1))
child.on('error', (error) => {
  console.error(error)
  process.exit(1)
})
