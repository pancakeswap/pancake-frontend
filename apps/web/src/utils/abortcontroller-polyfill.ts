import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'

if (!('timeout' in AbortSignal)) {
  const timeoutFN = (ms: number) => {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), ms)
    return controller.signal
  }
  ;(AbortSignal as any).timeout = timeoutFN
}
