import tokens from 'config/constants/tokens'
import { BIG_ZERO } from '../utils/bigNumber'
import { Tomb } from './types'

const tombs: Tomb[] = [
  {
    id: 2,
    pid: 11,
    name: 'ZMBE-BNB',
    lpAddress: {
      97: '',
      56: '0x4dbaf6479f0afa9f03c2a7d611151fa5b53ecdc8',
    },
    token: tokens.zmbe,
    quoteToken: tokens.wbnb,
    exchange: 'Pancakeswap',
    withdrawalCooldown: '3 days',
    result: {
      tokenWithdrawalDate: 0,
      amount: BIG_ZERO,
      totalStaked: BIG_ZERO,
      totalSupply: BIG_ZERO,
      reserves: [BIG_ZERO, BIG_ZERO],
    },
    poolInfo: {
      minimumStake: BIG_ZERO,
    },
    userInfo: {
      amount: BIG_ZERO,
      pendingZombie: BIG_ZERO,
      lpAllowance: BIG_ZERO,
      tokenWithdrawalDate: 0,
    },
  },
  {
    id: 1,
    pid: 12,
    name: 'ZMBE-BNB',
    lpAddress: {
      97: '',
      56: '0xcaa139138557610fe00f581498f283a789355d14',
    },
    token: tokens.zmbe,
    quoteToken: tokens.wbnb,
    exchange: 'Apeswap',
    withdrawalCooldown: '3 days',
    result: {
      tokenWithdrawalDate: 0,
      amount: BIG_ZERO,
      totalStaked: BIG_ZERO,
      totalSupply: BIG_ZERO,
      reserves: [BIG_ZERO, BIG_ZERO],
    },
    poolInfo: {
      minimumStake: BIG_ZERO,
    },
    userInfo: {
      amount: BIG_ZERO,
      pendingZombie: BIG_ZERO,
      lpAllowance: BIG_ZERO,
      tokenWithdrawalDate: 0
    },
  },
]

export default tombs
