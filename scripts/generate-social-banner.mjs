import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
// Use the rasterizer shipped with Next's image optimizer.
const sharp = createRequire(require.resolve('next/package.json'))('sharp')
await sharp('public/static/images/social-banner.svg')
  .png()
  .toFile('public/static/images/social-banner.png')
