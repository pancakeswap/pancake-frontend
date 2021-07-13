import {
  makeFutureRoundResponse,
  numberOrNull,
  transformBetResponse,
  transformTotalWonResponse,
} from 'state/predictions/helpers'

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
    expect(makeFutureRoundResponse(200, 1626054770)).toEqual({
      epoch: 200,
      startTimestamp: 1626054770,
      closeTimestamp: null,
      freezedCloseOracleRoundId: null,
      freezedLockOracleRoundId: null,
      lockTimestamp: null,
      priceResolved: false,
      lockPrice: null,
      closePrice: null,
      totalAmount: { hex: '0x00', type: 'BigNumber' },
      bullAmount: { hex: '0x00', type: 'BigNumber' },
      bearAmount: { hex: '0x00', type: 'BigNumber' },
      rewardBaseCalAmount: { hex: '0x00', type: 'BigNumber' },
      rewardAmount: { hex: '0x00', type: 'BigNumber' },
    })
  })
})

describe('transformBetResponse', () => {
  const userResponse = {
    id: 'user',
    address: 'address',
    block: '500',
    totalBets: '20',
    totalBNB: '43',
  }

  it('returns a correctly transformed betresponse without round', () => {
    const betResponseWithoutRound = {
      id: 'id',
      hash: 'hash',
      claimedHash: 'claimedHash',
      amount: '500',
      position: 'Bull',
      claimed: false,
      user: userResponse,
    }

    expect(transformBetResponse(betResponseWithoutRound)).toEqual({
      id: 'id',
      hash: 'hash',
      amount: 500,
      position: 'Bull',
      claimed: false,
      claimedHash: 'claimedHash',
      user: {
        id: 'user',
        address: 'address',
        block: 500,
        totalBets: 20,
        totalBNB: 43,
      },
    })
  })

  it('returns a correctly transformed betresponse with round', () => {
    const betResponseWithRound = {
      id: 'id',
      hash: 'hash',
      amount: '500',
      position: 'Bull',
      claimed: false,
      claimedHash: 'claimedHash',
      user: userResponse,
      round: {
        bearAmount: '200',
        bearBets: '10',
        bullAmount: '300',
        bullBets: '5',
        closePrice: '324.18079726',
        closeRoundId: '18446744073709625952',
        endAt: '1626055694',
        endBlock: '9079284',
        endHash: '0x77e5c201bf469f4ebbfc281598f2da946320b0bb4a629687fe4041cee127ab98',
        epoch: '101',
        failed: false,
        id: '101',
        lockAt: '1626055388',
        lockBlock: '9079182',
        lockHash: '0x8e7f4049a2b609a4037ac2df60b5a746487105a1a5efc7da824f59bcf6803e21',
        lockPrice: '324.38',
        lockRoundId: '18446744073709625937',
        position: 'Bear',
        startAt: '1626055079',
        startBlock: '9079079',
        startHash: '0xd8e42649f63bcdd98fb530d4c61b1c0a646c7a18f247b1931704a4a0c9b97def',
        totalAmount: '500',
        totalAmountTreasury: '0',
        totalBets: '15',
      },
    }

    expect(transformBetResponse(betResponseWithRound)).toEqual({
      id: 'id',
      hash: 'hash',
      amount: 500,
      position: 'Bull',
      claimed: false,
      claimedHash: 'claimedHash',
      round: {
        bearAmount: 200,
        bearBets: 10,
        bullAmount: 300,
        bullBets: 5,
        closePrice: 324.18079726,
        closeRoundId: '18446744073709625952',
        endAt: 1626055694,
        endBlock: 9079284,
        endHash: '0x77e5c201bf469f4ebbfc281598f2da946320b0bb4a629687fe4041cee127ab98',
        epoch: 101,
        failed: false,
        id: '101',
        lockAt: 1626055388,
        lockBlock: 9079182,
        lockHash: '0x8e7f4049a2b609a4037ac2df60b5a746487105a1a5efc7da824f59bcf6803e21',
        lockPrice: 324.38,
        lockRoundId: '18446744073709625937',
        position: 'Bear',
        startAt: 1626055079,
        startBlock: 9079079,
        startHash: '0xd8e42649f63bcdd98fb530d4c61b1c0a646c7a18f247b1931704a4a0c9b97def',
        totalAmount: 500,
        totalAmountTreasury: 0,
        totalBets: 15,
        bets: [],
      },
      user: {
        id: 'user',
        address: 'address',
        block: 500,
        totalBets: 20,
        totalBNB: 43,
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
