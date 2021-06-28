import BigNumber from 'bignumber.js'
import { BetPosition } from 'state/types'
import {
  formatBnb,
  formatRoundTime,
  formatUsd,
  getBnbAmount,
  getMultiplier,
  getPayout,
  padTime,
} from 'views/Predictions/helpers'

describe('getBnbAmount', () => {
  it.each([
    [2000000000000000000, 2],
    [500000000000000000, 0.5],
    [1658594666560000000, 1.65859466656],
    [1123456789000000000, 1.123456789],
  ])('format %i BNB correctly', (value, expected) => {
    const bnValue = getBnbAmount(new BigNumber(value))
    expect(bnValue.eq(expected)).toEqual(true)
  })
})

describe('formatUsd', () => {
  it.each([
    [500, '$500.000'],
    [265.22, '$265.220'],
    [689.889, '$689.889'],
    [10.8829, '$10.883'],
  ])('format %i USD correctly with 3 decimals', (value, expected) => {
    expect(formatUsd(value)).toEqual(expected)
  })

  it('returns 0 if USD is undefined', () => {
    expect(formatUsd(undefined)).toEqual('$0.000')
  })
})

describe('formatBnb', () => {
  it.each([
    [20, '20.000'],
    [265.22, '265.220'],
    [689.889, '689.889'],
    [10.8829, '10.883'],
  ])('format %i BNB correctly with 3 decimals', (value, expected) => {
    expect(formatBnb(value)).toEqual(expected)
  })

  it('returns 0 if BNB is undefined', () => {
    expect(formatBnb(undefined)).toEqual('0')
  })
})

describe('padTime', () => {
  it.each([
    [1, '01'],
    [9, '09'],
    [299, '299'],
    [0.3, '0.3'],
  ])('correctly pads %i', (value, expected) => {
    expect(padTime(value)).toEqual(expected)
  })
})

describe('formatRoundTime', () => {
  it.each([
    [55, '00:55'],
    [70, '01:10'],
    [4501, '01:15:01'],
  ])('given seconds (%i) returns correctly formatted time', (value, expected) => {
    expect(formatRoundTime(value)).toEqual(expected)
  })
})

describe('getMultiplier', () => {
  it.each([
    [100, 400, 0.25],
    [50000, 2500, 20],
    [0, 2500, 0],
    [10, 0, 0],
  ])('correctly calculates multiplier', (value, value2, expected) => {
    expect(getMultiplier(value, value2)).toEqual(expected)
  })
})

describe('getPayout', () => {
  const bet1Bull = {
    id: 'bet1',
    hash: 'bet1hash',
    amount: 500,
    position: BetPosition.BULL,
    claimed: false,
    claimedHash: 'hash',

    user: {
      id: 'bet1user',
      address: 'bet1address',
      block: 1000,
      totalBets: 0,
      totalBNB: 0,
    },
    round: {
      id: 'round',
      epoch: 4,
      startAt: 0,
      position: BetPosition.BEAR,
      startBlock: 1000,
      endBlock: 1000,
      bullAmount: 400,
      bearAmount: 200,
      totalAmount: 600,
      totalBets: 1,
      bets: [],
      closePrice: 250,
      lockPrice: 251,
      bullBets: 1,
      bearBets: 1,
      lockAt: 0,
      lockBlock: 1,
    },
  }

  const bet1Bear = {
    id: 'bet1',
    hash: 'bet1hash',
    amount: 500,
    position: BetPosition.BEAR,
    claimed: false,
    claimedHash: 'hash',

    user: {
      id: 'bet1user',
      address: 'bet1address',
      block: 1000,
      totalBets: 0,
      totalBNB: 0,
    },
    round: {
      id: 'round',
      epoch: 4,
      startAt: 0,
      position: BetPosition.BEAR,
      startBlock: 1000,
      endBlock: 1000,
      bullAmount: 400,
      bearAmount: 200,
      totalAmount: 600,
      totalBets: 1,
      bets: [],
      closePrice: 250,
      lockPrice: 251,
      bullBets: 1,
      bearBets: 1,
      lockAt: 0,
      lockBlock: 1,
    },
  }

  const bet2Bull = {
    id: 'bet2',
    hash: 'bet2hash',
    amount: 688,
    position: BetPosition.BULL,
    claimed: false,
    claimedHash: 'hash',
    user: {
      id: 'bet2user',
      address: 'bet2address',
      block: 1000,
      totalBets: 0,
      totalBNB: 0,
    },
    round: {
      id: 'round',
      epoch: 4,
      startAt: 0,
      position: BetPosition.BEAR,
      startBlock: 1000,
      endBlock: 1000,
      bullAmount: 2000,
      bearAmount: 1600,
      totalAmount: 3600,
      totalBets: 1,
      bets: [],
      closePrice: 250,
      lockPrice: 251,
      bullBets: 1,
      bearBets: 1,
      lockAt: 0,
      lockBlock: 1,
    },
  }

  const bet2Bear = {
    id: 'bet2',
    hash: 'bet2hash',
    amount: 688,
    position: BetPosition.BEAR,
    claimed: false,
    claimedHash: 'hash',
    user: {
      id: 'bet2user',
      address: 'bet2address',
      block: 1000,
      totalBets: 0,
      totalBNB: 0,
    },
    round: {
      id: 'round',
      epoch: 4,
      startAt: 0,
      position: BetPosition.BEAR,
      startBlock: 1000,
      endBlock: 1000,
      bullAmount: 2000,
      bearAmount: 1600,
      totalAmount: 3600,
      totalBets: 1,
      bets: [],
      closePrice: 250,
      lockPrice: 251,
      bullBets: 1,
      bearBets: 1,
      lockAt: 0,
      lockBlock: 1,
    },
  }

  it.each([
    [bet1Bull, 750],
    [bet1Bear, 1500],
    [bet2Bull, 1238.4],
    [bet2Bear, 1548],
  ])('correctly calculates payout', (value, expected) => {
    expect(getPayout(value)).toEqual(expected)
  })

  it.each([
    [bet1Bull, 0.97, 727.5],
    [bet1Bear, 0.97, 1455],
    [bet2Bull, 0.97, 1201.248],
    [bet2Bear, 0.97, 1501.56],
  ])('correctly calculates payout including reward rate', (value, rewardRate, expected) => {
    expect(getPayout(value, rewardRate)).toEqual(expected)
  })
})
