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
    expect(makeFutureRoundResponse(200, 500)).toEqual({
      epoch: 200,
      startBlock: 500,
      lockBlock: null,
      endBlock: null,
      lockPrice: null,
      closePrice: null,
      totalAmount: { hex: '0x00', type: 'BigNumber' },
      bullAmount: { hex: '0x00', type: 'BigNumber' },
      bearAmount: { hex: '0x00', type: 'BigNumber' },
      rewardBaseCalAmount: { hex: '0x00', type: 'BigNumber' },
      rewardAmount: { hex: '0x00', type: 'BigNumber' },
      oracleCalled: false,
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
      user: userResponse,
      round: {
        id: '200',
        epoch: '200',
        failed: false,
        startBlock: '500',
        startAt: '1000',
        lockAt: '1000',
        lockBlock: '500',
        lockPrice: '200',
        endBlock: '500',
        closePrice: '201',
        totalBets: '2',
        totalAmount: '100',
        bullBets: '1',
        bearBets: '1',
        bearAmount: '50',
        bullAmount: '50',
        position: null,
        bets: [],
      },
    }

    expect(transformBetResponse(betResponseWithRound)).toEqual({
      id: 'id',
      hash: 'hash',
      amount: 500,
      position: 'Bull',
      claimed: false,
      round: {
        id: '200',
        epoch: 200,
        failed: false,
        startBlock: 500,
        startAt: 1000,
        lockAt: 1000,
        lockBlock: 500,
        lockPrice: 200,
        endBlock: 500,
        closePrice: 201,
        totalBets: 2,
        totalAmount: 100,
        bullBets: 1,
        bearBets: 1,
        bearAmount: 50,
        bullAmount: 50,
        position: null,
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
