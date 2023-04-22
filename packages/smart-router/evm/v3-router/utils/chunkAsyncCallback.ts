import { chunk } from '../../utils/chunk'

export async function asyncChunkCallback<TData = unknown, TResult = unknown>(
  inputs: TData[],
  callback: (inputs: TData[]) => Promise<TResult[]>,
  chunkSize = 10,
): Promise<TResult[]> {
  if (chunkSize === 0) {
    return callback(inputs)
  }

  const requestCallback = typeof window === 'undefined' ? setTimeout : window.requestIdleCallback || window.setTimeout

  const wrappedCallback = (inputs_: TData[]): Promise<TResult[]> =>
    new Promise((resolve, reject) => {
      requestCallback(async () => {
        try {
          const result = await callback(inputs_)
          resolve(result)
        } catch (e) {
          reject(e)
        }
      })
    })

  const chunks = chunk(inputs, chunkSize)
  const result = await Promise.all(chunks.map(wrappedCallback))
  const results = result.reduce<TResult[]>((acc, cur) => [...acc, ...cur], [])
  return results
}
