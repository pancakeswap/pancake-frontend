import { BoosterConfig, BoosterType } from '../../utils/boosted/types'

export const opBnbBoostedPools: BoosterConfig[] = [
  {
    boosterType: BoosterType.ALP,
    contractAddress: '0xa1B46Cb13b43fb8Ae5dC7222e3294fcd10024168',
    tooltipsText:
      'Fee APY include the transaction fees shared in the ALP pool, funding rates for positions held, and liquidation income, and will be reflected in the growth of the ALP price. Stake APY is the return for staking ALP. Both Annualized using compound interest, for reference purposes only.',
  },
]
