type AsyncFn<T> = () => Promise<T>

interface AsyncCall<T> {
  asyncFn: AsyncFn<T>

  // In millisecond
  timeout?: number
}

function withTimeout<T>(fn: AsyncFn<T>, duration: number): AsyncFn<T> {
  return function callWithTimeout() {
    return Promise.race([
      fn(),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Request timeout ${duration}ms`)), duration)
      }) as Promise<T>,
    ])
  }
}

export function withFallback<T>(calls: AsyncCall<T>[]): AsyncFn<T> {
  return async function asyncCall() {
    const numOfCalls = calls.length
    if (numOfCalls === 0) {
      throw new Error('No valid calls')
    }
    for (const [index, { timeout = 2000, asyncFn }] of calls.entries()) {
      const fn = index < numOfCalls - 1 ? withTimeout<T>(asyncFn, timeout) : asyncFn
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await fn()
        return result
      } catch (e) {
        if (index === numOfCalls - 1) {
          throw e
        }
        // Fallback to next one
        console.error('Call failed with error', e, 'Try next fallback')
      }
    }
    throw new Error('Unexpected end of call')
  }
}
