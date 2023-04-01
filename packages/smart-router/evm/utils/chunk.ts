export function chunk<T = void>(list: T[], size = 1): T[][] {
  const safeSize = Math.max(Number.parseInt(String(size)), 0)
  const length = list == null ? 0 : list.length
  if (!length || safeSize < 1) {
    return []
  }
  let index = 0
  let resIndex = 0
  const result = new Array(Math.ceil(length / safeSize))

  while (index < length) {
    result[resIndex++] = list.slice(index, (index += safeSize))
  }
  return result
}
