export function sum(list: number[]) {
  let result: number | undefined
  for (const item of list) {
    if (result === undefined) {
      result = item
      continue
    }
    result += item
  }
  if (result === undefined) return 0
  return result
}
