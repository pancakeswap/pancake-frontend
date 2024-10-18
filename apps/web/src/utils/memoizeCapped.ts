import memoize from 'lodash/memoize'

export const memoizeCapped = <T extends (...args: any) => any>(func: T) => {
  const result = memoize(func, function (key) {
    // @ts-ignore
    if (cache?.size === 1000) {
      cache.clear?.()
    }
    return key
  })

  const cache = result.cache
  return result
}
