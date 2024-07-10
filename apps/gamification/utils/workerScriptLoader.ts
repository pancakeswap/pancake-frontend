import { WorkerUrlExtractor as Worker } from './workerUrlExtractor'

// Using alias to allow worker url to be statically analyzable by webpack
// @see https://github.com/webpack/webpack/discussions/14648#discussioncomment-1589272
export function createWorkerScriptLoader() {
  const worker = new Worker(/* webpackChunkName: "quote-worker" */ new URL('../quote-worker.ts', import.meta.url))
  let loadScriptPromise: Promise<string> | undefined

  return async function loadWorkerScript() {
    if (!loadScriptPromise) {
      loadScriptPromise = fetch(worker.url, { cache: 'force-cache' })
        .then((r) => r.blob())
        .then((b) => {
          const base = typeof window !== 'undefined' ? window.location.href : undefined
          const addtionalWorkerSource = `
            const originalImportScripts = self.importScripts;
            self.importScripts = (url) => originalImportScripts.call(self, new URL(url, "${base}").toString());
          `
          return new Blob([addtionalWorkerSource, b], { type: 'application/javascript' })
        })
        .then((b) => URL.createObjectURL(b))
    }
    return loadScriptPromise
  }
}
