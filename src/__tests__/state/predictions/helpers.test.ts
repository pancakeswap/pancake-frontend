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
      oracleCalled: false,
      lockOracleId: null,
      closeOracleId: null,
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
  totalBets: '2',
})

describe('transformBetResponse', () => {
  const userResponse = {
    averageBNB: '0.005',
    block: '9315031',
    createdAt: '1626763291',
    id: '0x335d6a2c3dd0c04a21f41d30c9ee75e640a87890',
    netBNB: '-0.0055',
    totalBNB: '0.005',
    totalBNBBear: '0.005',
    totalBNBBull: '0',
    totalBNBClaimed: '0.0045',
    totalBets: '1',
    totalBetsBear: '0',
    totalBetsBull: '1',
    totalBetsClaimed: '1',
    updatedAt: '1626763291',
    winRate: '100',
  }

  it('returns a correctly transformed betresponse without round', () => {
    const betResponseWithoutRound = {
      amount: '0.001030231215331515',
      block: '9318174',
      claimed: false,
      claimedAt: null,
      claimedBNB: null,
      claimedBlock: null,
      claimedHash: null,
      claimedNetBNB: null,
      createdAt: '1626772720',
      hash: '0xbf9a414080b76f1139e087a50d79535a5014c472e24850b1bfc767c6d92ac947',
      id: '0x1fd3a652f5d078add86e1d6f1c817fe0cd0541f5f3000000',
      position: 'Bull',
      updatedAt: '1626772720',
      user: userResponse,
    }

    expect(transformBetResponse(betResponseWithoutRound)).toEqual({
      amount: 0.001030231215331515,
      block: 9318174,
      claimed: false,
      claimedAt: null,
      claimedBNB: 0,
      claimedBlock: null,
      claimedHash: null,
      claimedNetBNB: 0,
      createdAt: 1626772720,
      hash: '0xbf9a414080b76f1139e087a50d79535a5014c472e24850b1bfc767c6d92ac947',
      id: '0x1fd3a652f5d078add86e1d6f1c817fe0cd0541f5f3000000',
      position: 'Bull',
      updatedAt: 1626772720,
      user: {
        averageBNB: 0.005,
        block: 9315031,
        createdAt: 1626763291,
        id: '0x335d6a2c3dd0c04a21f41d30c9ee75e640a87890',
        netBNB: -0.0055,
        totalBNB: 0.005,
        totalBNBBear: 0.005,
        totalBNBBull: 0,
        totalBets: 1,
        totalBNBClaimed: 0.0045,
        totalBetsBear: 0,
        totalBetsBull: 1,
        totalBetsClaimed: 1,
        updatedAt: 1626763291,
        winRate: 100,
      },
    })
  })

  it('returns a correctly transformed betresponse with round', () => {
    const betResponseWithRound = {
      amount: '0.001030231215331515',
      block: '9318174',
      claimed: false,
      claimedAt: null,
      claimedBNB: null,
      claimedBlock: null,
      claimedHash: null,
      claimedNetBNB: null,
      createdAt: '1626772720',
      hash: '0xbf9a414080b76f1139e087a50d79535a5014c472e24850b1bfc767c6d92ac947',
      id: '0x1fd3a652f5d078add86e1d6f1c817fe0cd0541f5f3000000',
      position: 'Bull',
      updatedAt: '1626772720',
      user: userResponse,
      round: {
        bearAmount: '0',
        bearBets: '0',
        bullAmount: '0',
        bullBets: '0',
        closeAt: '1626729461',
        closeBlock: '9303767',
        closeHash: '0x62268d7f26d1247df21cf4c28fd0f7ffc8f16ce4302fb52f83fbec536710014c',
        closePrice: '283.53',
        closeRoundId: '18446744073709659281',
        epoch: '102',
        failed: null,
        id: '102',
        lockAt: '1626729155',
        lockBlock: '9303665',
        lockHash: '0xab171a67ba3597594287a617878d72c9b28abc82569062b8d3ab92cca2b9ce6c',
        lockPrice: '282.97',
        lockRoundId: '18446744073709659265',
        position: 'Bull',
        startAt: '1626728849',
        startBlock: '9303563',
        startHash: '0xca83e0aaf3113ed18203b69e2ca7598c3df80acc9229aab50304d16c19965945',
        totalAmount: '0',
        totalAmountTreasury: '0',
        totalBets: '0',
        bets: [],
      },
    }

    expect(transformBetResponse(betResponseWithRound)).toEqual({
      amount: 0.001030231215331515,
      block: 9318174,
      claimed: false,
      claimedAt: null,
      claimedBNB: 0,
      claimedBlock: null,
      claimedHash: null,
      claimedNetBNB: 0,
      createdAt: 1626772720,
      hash: '0xbf9a414080b76f1139e087a50d79535a5014c472e24850b1bfc767c6d92ac947',
      id: '0x1fd3a652f5d078add86e1d6f1c817fe0cd0541f5f3000000',
      position: 'Bull',
      updatedAt: 1626772720,
      round: {
        bearAmount: 0,
        bearBets: 0,
        bullAmount: 0,
        bullBets: 0,
        closeAt: 1626729461,
        closeBlock: 9303767,
        closeHash: '0x62268d7f26d1247df21cf4c28fd0f7ffc8f16ce4302fb52f83fbec536710014c',
        closePrice: 283.53,
        closeRoundId: '18446744073709659281',
        epoch: 102,
        failed: null,
        id: '102',
        lockAt: 1626729155,
        lockBlock: 9303665,
        lockHash: '0xab171a67ba3597594287a617878d72c9b28abc82569062b8d3ab92cca2b9ce6c',
        lockPrice: 282.97,
        lockRoundId: '18446744073709659265',
        position: 'Bull',
        startAt: 1626728849,
        startBlock: 9303563,
        startHash: '0xca83e0aaf3113ed18203b69e2ca7598c3df80acc9229aab50304d16c19965945',
        totalAmount: 0,
        totalBets: 0,
        bets: [],
      },
      user: {
        averageBNB: 0.005,
        block: 9315031,
        createdAt: 1626763291,
        id: '0x335d6a2c3dd0c04a21f41d30c9ee75e640a87890',
        netBNB: -0.0055,
        totalBNB: 0.005,
        totalBNBBear: 0.005,
        totalBNBBull: 0,
        totalBets: 1,
        totalBNBClaimed: 0.0045,
        totalBetsBear: 0,
        totalBetsBull: 1,
        totalBetsClaimed: 1,
        updatedAt: 1626763291,
        winRate: 100,
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
