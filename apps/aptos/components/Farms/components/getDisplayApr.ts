export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number, dualRewardsApr?: number) => {
  return ((cakeRewardsApr ?? 0) + (lpRewardsApr ?? 0) + (dualRewardsApr ?? 0)).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })
}
