if (!('timeout' in AbortSignal)) {
  import('abortcontroller-polyfill/dist/abortcontroller-polyfill-only')
    .then(() => {
      const timeoutFN = (ms: number) => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), ms)
        return controller.signal
      }
      ;(AbortSignal as any).timeout = timeoutFN
    })
    .catch((err) => {
      console.error('Error loading polyfill:', err)
    })
}
