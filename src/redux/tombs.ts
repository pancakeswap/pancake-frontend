import tokens from "config/constants/tokens";
import { BIG_ZERO } from '../utils/bigNumber'

const tombs = [
  {
    id: 1,
    pid: 11,
    name: 'ZMBE-BNB',
    lpAddresses: {
      97: '',
      56: '0x4dbaf6479f0afa9f03c2a7d611151fa5b53ecdc8',
    },
    token: tokens.zmbe,
    quoteToken: tokens.wbnb,
    withdrawalCooldown: '3 days',
    stakingToken: undefined,
    result: {
      tokenWithdrawalDate: 0,
      amount: BIG_ZERO,
      pendingZombie: BIG_ZERO,
      totalStaked: BIG_ZERO,
      totalSupply: BIG_ZERO,
      reserves: [BIG_ZERO, BIG_ZERO],
    },
    poolInfo: {
      minimumStake : BIG_ZERO
    },
  },
]

export default tombs;
