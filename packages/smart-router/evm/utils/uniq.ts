export function uniq<T = void>(list: T[]): T[] {
  const uniqSet = new Set<T>()
  const result: T[] = []
  for (const item of list) {
    if (uniqSet.has(item)) {
      continue
    }
    uniqSet.add(item)
    result.push(item)
  }
  return result
}
