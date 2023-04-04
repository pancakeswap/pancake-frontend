export function mapValues<T = void, R = void>(obj: { [key: string]: T }, map: (item: T) => R) {
  const result: { [key: string]: R } = {}
  for (const key of Object.keys(obj)) {
    result[key] = map(obj[key])
  }
  return result
}
