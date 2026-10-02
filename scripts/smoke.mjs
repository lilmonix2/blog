// Check original assets as well as pages: optimized thumbnails can hide a broken /static proxy.
const origin = process.argv[2] || 'http://127.0.0.1:3000'
const { readFile } = await import('node:fs/promises')
const routes = JSON.parse(await readFile('.next/routes-manifest.json', 'utf8'))
const basePath = process.env.BASE_PATH || routes.basePath || ''
const get = async (path) => {
  const url = `${origin.replace(/\/$/, '')}${basePath}${path}`
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  return response
}
for (const path of [
  '/',
  '/blog',
  '/tags',
  '/about',
  '/search.json',
  '/feed.xml',
  '/sitemap.xml',
  '/static/images/social-banner.png',
  '/static/images/the_type_of_reactive_variables_in_vue/img_2.png',
]) {
  const response = await get(path)
  if (path.endsWith('.png') && !response.headers.get('content-type')?.startsWith('image/'))
    throw new Error(`Expected image: ${path}`)
  await response.arrayBuffer()
}
for (const path of ['/blog/page/2abc', '/blog/page/0', '/tags/nonexistent-tag', '/projects']) {
  const response = await fetch(`${origin.replace(/\/$/, '')}${basePath}${path}`, {
    signal: AbortSignal.timeout(15000),
  })
  if (response.status !== 404) throw new Error(`Expected 404: ${path}, got ${response.status}`)
}
console.log(`HTTP smoke checks passed: ${origin}${basePath}`)
