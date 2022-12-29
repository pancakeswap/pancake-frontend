export const trimTrailZero = (numberStr?: string) => {
  if (!numberStr || !numberStr.includes('.')) return numberStr
  const splitNum = numberStr.split('.')
  while (splitNum[1][splitNum[1].length - 1] === '0') splitNum[1] = splitNum[1].slice(0, -1)
  return splitNum[1].length ? `${splitNum[0]}.${splitNum[1]}` : splitNum[0]
}
