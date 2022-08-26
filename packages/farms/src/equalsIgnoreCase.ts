export const equalsIgnoreCase = (a: string, b: string) => {
  return a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
}
