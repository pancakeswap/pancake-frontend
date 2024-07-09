export const getDisplayApr = (cakeRewardsApr?: number, lpRewardsApr?: number, additionalAPR?: number) => {
  if ((cakeRewardsApr || cakeRewardsApr === 0) && (lpRewardsApr || lpRewardsApr === 0)) {
    return (cakeRewardsApr + lpRewardsApr + (additionalAPR ?? 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (cakeRewardsApr) {
    return (cakeRewardsApr + (additionalAPR ?? 0)).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
