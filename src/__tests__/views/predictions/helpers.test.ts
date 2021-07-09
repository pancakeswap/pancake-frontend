import { ethers } from 'ethers'
import { BetPosition } from 'state/types'
import { formatRoundTime, getNetPayoutv2, getPayoutv2, padTime } from 'views/Predictions/helpers'

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

describe('getPayout', () => {
  it.each([
    [
      '28602547725553480077',
      '26278587683044618393',
      '3208574920618763130',
      '200000000000000000',
      BetPosition.BEAR,
      '1.782',
    ],
    [
      '28602547725553480077',
      '26278587683044618393',
      '3208574920618763130',
      '200000000000000000',
      BetPosition.BULL,
      '0.217',
    ],
    [
      '24687803148488403426',
      '7616553565521982679',
      '17834789886527917761',
      '500000000000000000',
      BetPosition.BEAR,
      '0.692',
    ],
    [
      '24687803148488403426',
      '7616553565521982679',
      '17834789886527917761',
      '500000000000000000',
      BetPosition.BULL,
      '1.620',
    ],
    [
      '22468153765446914542',
      '7914500466722029957',
      '15248544652295407716',
      '100000000000000000',
      BetPosition.BEAR,
      '0.147',
    ],
    [
      '22468153765446914542',
      '7914500466722029957',
      '15248544652295407716',
      '100000000000000000',
      BetPosition.BULL,
      '0.283',
    ],
  ])(
    'calculates payout correctly within 3 decimals',
    (rewardAmountStr, bullAmountStr, bearAmountStr, betAmountStr, position, expected) => {
      const ledger = {
        position,
        amount: ethers.BigNumber.from(betAmountStr),
        claimed: false,
      }
      const round = {
        epoch: 1,
        startBlock: 0,
        lockBlock: 0,
        endBlock: 0,
        lockPrice: ethers.BigNumber.from(0),
        closePrice: ethers.BigNumber.from(0),
        totalAmount: ethers.BigNumber.from(0),
        bullAmount: ethers.BigNumber.from(bullAmountStr),
        bearAmount: ethers.BigNumber.from(bearAmountStr),
        rewardAmount: ethers.BigNumber.from(rewardAmountStr),
        rewardBaseCalAmount: ethers.BigNumber.from(0),
        oracleCalled: true,
      }

      const payout = getPayoutv2(ledger, round)
      expect(payout.toString()).toContain(expected)
    },
  )
})

describe('getNetPayout', () => {
  it.each([
    [
      '28602547725553480077',
      '26278587683044618393',
      '3208574920618763130',
      '200000000000000000',
      BetPosition.BEAR,
      '1.582',
    ],
    [
      '28602547725553480077',
      '26278587683044618393',
      '3208574920618763130',
      '200000000000000000',
      BetPosition.BULL,
      '0.017',
    ],
    [
      '24687803148488403426',
      '7616553565521982679',
      '17834789886527917761',
      '500000000000000000',
      BetPosition.BEAR,
      '0.192',
    ],
    [
      '24687803148488403426',
      '7616553565521982679',
      '17834789886527917761',
      '500000000000000000',
      BetPosition.BULL,
      '1.120',
    ],
    [
      '22468153765446914542',
      '7914500466722029957',
      '15248544652295407716',
      '100000000000000000',
      BetPosition.BEAR,
      '0.047',
    ],
    [
      '22468153765446914542',
      '7914500466722029957',
      '15248544652295407716',
      '100000000000000000',
      BetPosition.BULL,
      '0.183',
    ],
  ])(
    'calculates payout correctly within 3 decimals',
    (rewardAmountStr, bullAmountStr, bearAmountStr, betAmountStr, position, expected) => {
      const ledger = {
        position,
        amount: ethers.BigNumber.from(betAmountStr),
        claimed: false,
      }
      const round = {
        epoch: 1,
        startBlock: 0,
        lockBlock: 0,
        endBlock: 0,
        lockPrice: ethers.BigNumber.from(0),
        closePrice: ethers.BigNumber.from(0),
        totalAmount: ethers.BigNumber.from(0),
        bullAmount: ethers.BigNumber.from(bullAmountStr),
        bearAmount: ethers.BigNumber.from(bearAmountStr),
        rewardAmount: ethers.BigNumber.from(rewardAmountStr),
        rewardBaseCalAmount: ethers.BigNumber.from(0),
        oracleCalled: true,
      }

      const payout = getNetPayoutv2(ledger, round)
      expect(payout.toString()).toContain(expected)
    },
  )
})
