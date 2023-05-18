import BigNumber from 'bignumber.js'

export const incentiveFormat = (incentive) => {
  const [
    totalRewardUnclaimed,
    totalReward,
    totalTradingFee,
    proofRoot,
    campaignStart,
    campaignClaimTime,
    campaignClaimEndTime,
    isActivated,
    isDynamicReward,
  ] = incentive

  return {
    proofRoot,
    isActivated,
    isDynamicReward,
    totalReward: new BigNumber(totalReward.toString()).toJSON(),
    totalTradingFee: new BigNumber(totalTradingFee.toString()).toNumber(),
    campaignStart: new BigNumber(campaignStart.toString()).toNumber(),
    campaignClaimTime: new BigNumber(campaignClaimTime.toString()).toNumber(),
    campaignClaimEndTime: new BigNumber(campaignClaimEndTime.toString()).toNumber(),
    totalRewardUnclaimed: new BigNumber(totalRewardUnclaimed.toString()).toJSON(),
  }
}
