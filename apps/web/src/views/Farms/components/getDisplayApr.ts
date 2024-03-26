export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number) => {
  if ((cakeRewardsApr || cakeRewardsApr === 0) && (lpRewardsApr || lpRewardsApr === 0)) {
    return (cakeRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return cakeRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
