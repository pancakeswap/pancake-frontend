import {
  makeFutureRoundResponse,
  numberOrNull,
  transformBetResponse,
  transformTotalWonResponse,
} from 'state/predictions/helpers'
import { BetResponse, RoundResponse } from 'state/predictions/queries'

describe('numberOrNull', () => {
  it.each([
    ['2', 2],
    ['7.308', 7.308],
    [null, null],
    ['test', null],
  ])('return %s correctly as number, null, or NaN', (value, expected) => {
    expect(numberOrNull(value)).toEqual(expected)
  })
})

describe('makeFutureRoundResponse', () => {
  it('returns a correctly transformed future round response', () => {
    expect(makeFutureRoundResponse(200, 1626243374)).toEqual({
      epoch: 200,
      startTimestamp: 1626243374,
      lockTimestamp: null,
      closeTimestamp: null,
      lockPrice: null,
      closePrice: null,
      totalAmount: { hex: '0x00', type: 'BigNumber' },
      bullAmount: { hex: '0x00', type: 'BigNumber' },
      bearAmount: { hex: '0x00', type: 'BigNumber' },
      rewardBaseCalAmount: { hex: '0x00', type: 'BigNumber' },
      rewardAmount: { hex: '0x00', type: 'BigNumber' },
      priceResolved: false,
    })
  })
})

const getBetResponse = () => {
  return {
    amount: '0.1',
    block: '9085125',
    claimed: false,
    claimedAt: null,
    claimedBNB: null,
    claimedHash: null,
    claimedNetBNB: null,
    createdAt: '1626073217',
    hash: '0x8a8ca8a2da4522f6bfcbbe443848a963363ddf03604e64cb8ef31bb60018f588',
    id: '0x3249d704a6a80731d990857e54d8222916b1c1619f000000',
    position: 'Bull',
    updatedAt: '1626073217',
    user: {
      averageBNB: '0.1',
      block: '9085125',
      createdAt: '1626073217',
      id: '0x3249d704a6a80731d990857e54d8222916b1c161',
      netBNB: '-0.1',
      totalBNB: '0.1',
      totalBNBBear: '0.1',
      totalBNBBull: '0',
      totalBets: '1',
      totalBetsBear: '0',
      totalBetsBull: '1',
      totalBetsClaimed: '0',
      totalBNBClaimed: '0',
      updatedAt: '1626073217',
      winRate: '0',
    },
  } as BetResponse
}

const getRoundResponse = (): RoundResponse => ({
  bearAmount: '0.1',
  bearBets: '1',
  bullAmount: '0.1',
  bullBets: '1',
  closeAt: '1626073646',
  closeBlock: '9085268',
  closeHash: '0x4198fd63de00419f55722fc423a2e021f02cfc651cc49b374199423ad1e3096d',
  closePrice: '332.11',
  closeRoundId: '18446744073709626850',
  epoch: '159',
  failed: null,
  id: '159',
  lockAt: '1626073337',
  lockBlock: '9085165',
  lockHash: '0x71097fbb98bff5645b8d3aae45f34d67bba8be71127fc10d47aa65b9a7b2d939',
  lockPrice: '332.85',
  lockRoundId: '18446744073709626834',
  position: 'Bear',
  startAt: '1626073028',
  startBlock: '9085062',
  startHash: '0xa42669cb24e41d31a060e2dbf41ae7a50f5ace5eaa28be40d669c3ab0f643861',
  totalAmount: '0.2',
  totalAmountTreasury: '0.02',
  totalBets: '2',
})

describe('transformBetResponse', () => {
  it('returns a correctly transformed betresponse without round', () => {
    expect(transformBetResponse(getBetResponse())).toEqual({
      amount: 0.1,
      block: 9085125,
      claimed: false,
      claimedAt: null,
      claimedBNB: 0,
      claimedHash: null,
      claimedNetBNB: 0,
      createdAt: 1626073217,
      hash: '0x8a8ca8a2da4522f6bfcbbe443848a963363ddf03604e64cb8ef31bb60018f588',
      id: '0x3249d704a6a80731d990857e54d8222916b1c1619f000000',
      position: 'Bull',
      updatedAt: 1626073217,
      user: {
        averageBNB: 0.1,
        block: 9085125,
        createdAt: 1626073217,
        id: '0x3249d704a6a80731d990857e54d8222916b1c161',
        netBNB: -0.1,
        totalBNB: 0.1,
        totalBNBBear: 0.1,
        totalBNBBull: 0,
        totalBets: 1,
        totalBetsBear: 0,
        totalBetsBull: 1,
        totalBetsClaimed: 0,
        totalBNBClaimed: 0,
        updatedAt: 1626073217,
        winRate: 0,
      },
    })
  })

  it('returns a correctly transformed betresponse with round', () => {
    const betResponse = getBetResponse()
    betResponse.round = getRoundResponse()

    expect(transformBetResponse(betResponse)).toEqual({
      amount: 0.1,
      block: 9085125,
      claimed: false,
      claimedAt: null,
      claimedBNB: 0,
      claimedHash: null,
      claimedNetBNB: 0,
      createdAt: 1626073217,
      hash: '0x8a8ca8a2da4522f6bfcbbe443848a963363ddf03604e64cb8ef31bb60018f588',
      id: '0x3249d704a6a80731d990857e54d8222916b1c1619f000000',
      position: 'Bull',
      updatedAt: 1626073217,
      round: {
        bearAmount: 0.1,
        bearBets: 1,
        bullAmount: 0.1,
        bullBets: 1,
        closeAt: 1626073646,
        closeBlock: 9085268,
        closeHash: '0x4198fd63de00419f55722fc423a2e021f02cfc651cc49b374199423ad1e3096d',
        closePrice: 332.11,
        closeRoundId: '18446744073709626850',
        epoch: 159,
        failed: null,
        id: '159',
        lockAt: 1626073337,
        lockBlock: 9085165,
        lockHash: '0x71097fbb98bff5645b8d3aae45f34d67bba8be71127fc10d47aa65b9a7b2d939',
        lockPrice: 332.85,
        lockRoundId: '18446744073709626834',
        position: 'Bear',
        startAt: 1626073028,
        startBlock: 9085062,
        startHash: '0xa42669cb24e41d31a060e2dbf41ae7a50f5ace5eaa28be40d669c3ab0f643861',
        totalAmount: 0.2,
        totalAmountTreasury: 0.02,
        totalBets: 2,
        bets: [],
      },
      user: {
        averageBNB: 0.1,
        block: 9085125,
        createdAt: 1626073217,
        id: '0x3249d704a6a80731d990857e54d8222916b1c161',
        netBNB: -0.1,
        totalBNB: 0.1,
        totalBNBBear: 0.1,
        totalBNBBull: 0,
        totalBets: 1,
        totalBetsBear: 0,
        totalBetsBull: 1,
        totalBetsClaimed: 0,
        totalBNBClaimed: 0,
        updatedAt: 1626073217,
        winRate: 0,
      },
    })
  })
})

describe('transformTotalWonResponse', () => {
  it('returns a correctly transformed total won response', () => {
    const totalWonMarketResponse = {
      totalBNB: '200',
      totalBNBTreasury: '100',
    }
    const roundResponse = [{ totalAmount: '5' }, { totalAmount: '2' }]
    expect(transformTotalWonResponse(totalWonMarketResponse, roundResponse)).toEqual(93)
  })
})
