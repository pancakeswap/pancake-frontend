import { BoosterConfig, BoosterType } from '../../utils/boosted/types'

export const arbBoostedPools: BoosterConfig[] = [
  {
    boosterType: BoosterType.ALP,
    contractAddress: '0x85146C0c5968d9640121eebd13030c99298f87b3',
    tooltipsText:
      'Fee APY include the transaction fees shared in the ALP pool, funding rates for positions held, and liquidation income, and will be reflected in the growth of the ALP price. Stake APY is the return for staking ALP. Both Annualized using compound interest, for reference purposes only.',
  },
  {
    boosterType: BoosterType.ALP,
    contractAddress: '0xCe10072E051DA9B8e297AC439B3d7c5C45A32c8f',
    tooltipsText:
      'Fee APY include the transaction fees shared in the ALP pool, funding rates for positions held, and liquidation income, and will be reflected in the growth of the ALP price. Stake APY is the return for staking ALP. Both Annualized using compound interest, for reference purposes only.',
  },
]
