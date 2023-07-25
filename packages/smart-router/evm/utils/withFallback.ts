type AnyAsyncFunction = (...args: any[]) => Promise<any>

export interface AsyncCall<F extends AnyAsyncFunction> {
  asyncFn: F

  // In millisecond
  timeout?: number
}

function withTimeout<F extends AnyAsyncFunction>(fn: F, duration: number) {
  return function callWithTimeout(...args: Parameters<F>) {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Request timeout ${duration}ms`)), duration)
      }) as ReturnType<F>,
    ])
  }
}

export function withFallback<F extends AnyAsyncFunction>(calls: AsyncCall<F>[]) {
  return async function asyncCall(...args: Parameters<F>) {
    const numOfCalls = calls.length
    if (numOfCalls === 0) {
      throw new Error('No valid calls')
    }
    for (const [index, { timeout = 2000, asyncFn }] of calls.entries()) {
      const fn = index < numOfCalls - 1 ? withTimeout(asyncFn, timeout) : asyncFn
      try {
        // eslint-disable-next-line no-await-in-loop
        const result = await fn(...args)
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
