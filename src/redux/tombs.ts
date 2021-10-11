import tokens from 'config/constants/tokens'
import { BIG_ZERO } from '../utils/bigNumber'
import { Tomb } from './types'

const tombs: Tomb[] = [
  {
    id: 3,
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
    poolInfo: {
      minimumStake: BIG_ZERO,
      allocPoint: BIG_ZERO,
      totalStaked: BIG_ZERO,
      lpTotalSupply: BIG_ZERO,
      reserves: [BIG_ZERO, BIG_ZERO],
    },
    userInfo: {
      amount: BIG_ZERO,
      pendingZombie: BIG_ZERO,
      lpAllowance: BIG_ZERO,
      tokenWithdrawalDate: 0,
    },
  },
  {
    id: 2,
    pid: 29,
    name: 'ZMBE-BNB',
    lpAddress: {
      97: '',
      56: '0x9478DFb372cF5bDB2c87B8AE712698E8C8460c3e',
    },
    token: tokens.zmbe,
    quoteToken: tokens.wbnb,
    exchange: 'Autoshark',
    withdrawalCooldown: 'None!',
    poolInfo: {
      minimumStake: BIG_ZERO,
      allocPoint: BIG_ZERO,
      totalStaked: BIG_ZERO,
      lpTotalSupply: BIG_ZERO,
      reserves: [BIG_ZERO, BIG_ZERO],
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
    pid: 17,
    name: 'ZMBE-BNB',
    lpAddress: {
      97: '',
      56: '0xcaa139138557610fe00f581498f283a789355d14',
    },
    token: tokens.zmbe,
    quoteToken: tokens.wbnb,
    exchange: 'Apeswap',
    withdrawalCooldown: '3 days',
    notNativeDex: true,
    isNew: true,
    poolInfo: {
      minimumStake: BIG_ZERO,
      allocPoint: BIG_ZERO,
      totalStaked: BIG_ZERO,
      lpTotalSupply: BIG_ZERO,
      reserves: [BIG_ZERO, BIG_ZERO],
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
