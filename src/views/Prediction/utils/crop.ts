import { bnToDec } from 'utils'
import BigNumber from 'bignumber.js'
import { STATUS, IRound, IBetInfo, DIRECTION } from '../types'

const KEYS = [
  {
    key: 'epoch',
    decimals: 0,
    precision: 0
  },
  {
    key: 'lockPrice',
    decimals: 6,
  },
  {
    key: 'endPrice',
    decimals: 6,
  },
  {
    key: 'totalAmount',
    decimals: 18,
  },
  {
    key: 'bullAmount',
    decimals: 18,
  },
  {
    key: 'bearAmount',
    decimals: 18,
  },
  {
    key: 'rewardBaseCalAmount',
    decimals: 18,
  },
  {
    key: 'rewardAmount',
    decimals: 18,
  },
]

export function cropRound(rounds: IRound[], status: STATUS): IRound[] {
  return rounds.map<IRound>((item) => {
    const rs = KEYS.reduce<IRound>(
      (a, { key, decimals, precision = 4 }) => ({
        ...a,
        [key]: new BigNumber(bnToDec(new BigNumber(item[key]), decimals)).toFixed(precision)
      }),
      {} as IRound,
    )
    rs.status = status
    return rs
  })
}

const defaultBet = {
  claimed: false,
  claimable: false,
  amount: '0',
  direction: false,
}
export function cropRoundWithBetInfo(rounds: IRound[], betInfos: IBetInfo[] = []) {
  return [...rounds].map<IRound>((item, idx) => {
    const bet = betInfos[idx] || defaultBet
    return {
      ...item,
      claimed: bet.claimed,
      claimable: bet.claimable,
      userDirection: bet.direction ? DIRECTION.BULL : DIRECTION.BEAR,
      userAmount: new BigNumber(bnToDec(new BigNumber(bet.amount || '0'))).toFixed(4),
    }
  })
}

export default {}
