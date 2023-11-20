import { BoosterConfig, BoosterType } from '../../utils/boosted/types'

export const arbBoostedPools: BoosterConfig[] = [
  {
    boosterType: BoosterType.ALP,
    contractAddress: '0x0639c5715EC308E16f089c96C0C109302d76FA81',
    tooltipsText:
      'Fee APY include the transaction fees shared in the ALP pool, funding rates for positions held, and liquidation income, and will be reflected in the growth of the ALP price. Stake APY is the return for staking ALP. Both Annualized using compound interest, for reference purposes only.',
  },
]
