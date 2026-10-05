import { readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})

try {
  const { render } = await server.ssrLoadModule('/src/entry-server.tsx')
  const output = new URL('../dist/index.html', import.meta.url)
  const html = await readFile(output, 'utf8')
  const placeholder = '<div id="root"></div>'
  if (!html.includes(placeholder)) {
    throw new Error('Prerender failed: root placeholder is missing')
  }
  await writeFile(output, html.replace(placeholder, () => `<div id="root">${render()}</div>`))
  console.log('Prerendered React content into dist/index.html')
} finally {
  await server.close()
}
