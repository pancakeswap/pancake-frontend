export const getDisplayFarmCakePerSecond = (poolWeight?: number, cakePerBlock?: string) => {
  if (!poolWeight || !cakePerBlock) return '0'

  const farmCakePerSecond = (poolWeight * Number(cakePerBlock)) / 1e8

  return farmCakePerSecond < 0.000001 ? '<0.000001' : `~${farmCakePerSecond.toFixed(6)}`
}
