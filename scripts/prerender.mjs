import { readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const rootMarker = '<div id="root"></div>'

export function injectAppMarkup(html, appMarkup) {
  if (!appMarkup.trim()) {
    throw new Error('Cannot prerender empty application markup')
  }

  if (!html.includes(rootMarker)) {
    throw new Error('Generated HTML is missing the root marker')
  }

  const renderedHtml = html.replace(rootMarker, `<div id="root">${appMarkup}</div>`)
  if (!renderedHtml.includes('<h1')) {
    throw new Error('Prerendered homepage is missing its H1')
  }

  return renderedHtml
}

async function prerenderHomepage() {
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const outputPath = join(projectRoot, 'dist', 'index.html')
  const serverOutputDirectory = join(projectRoot, '.prerender')
  const serverEntry = join(serverOutputDirectory, 'entry-server.js')

  try {
    const [html, serverModule] = await Promise.all([
      readFile(outputPath, 'utf8'),
      import(pathToFileURL(serverEntry).href),
    ])

    if (typeof serverModule.render !== 'function') {
      throw new Error('SSR bundle does not export render()')
    }

    await writeFile(outputPath, injectAppMarkup(html, serverModule.render()), 'utf8')
  } finally {
    await rm(serverOutputDirectory, { recursive: true, force: true })
  }
}

const isDirectExecution = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])
if (isDirectExecution) {
  await prerenderHomepage()
}
