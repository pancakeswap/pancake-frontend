import { ERC20Token, Price } from '@pancakeswap/sdk'
import getRatePercentageDifference from './getRatePercentageDifference'
import { PercentageDirection, getRatePercentageMessage } from './getRatePercentageMessage'

const CAKE = new ERC20Token(56, '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', 18, 'CAKE', 'PancakeSwap Token')
const BUSD = new ERC20Token(56, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD')

const EIGHTEEN_DECIMALS = 10n ** 18n
const ONE = 1n * EIGHTEEN_DECIMALS
const FIVE = 5n * EIGHTEEN_DECIMALS
const SEVEN = 7n * EIGHTEEN_DECIMALS
const SEVEN_HUNDRED = 700n * EIGHTEEN_DECIMALS
const ELEVEN = 11n * EIGHTEEN_DECIMALS

const ONE_BUSD_PER_CAKE = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, ONE)
const FIVE_BUSD_PER_CAKE = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, FIVE)
const SEVEN_BUSD_PER_CAKE = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, SEVEN)
const ELEVEN_BUSD_PER_CAKE = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, ELEVEN)
const SEVEN_HUNDRED_BUSD_PER_CAKE = new Price(CAKE, BUSD, EIGHTEEN_DECIMALS, SEVEN_HUNDRED)

const mockT = (key: string, data?: { percentage?: string }) => {
  return key.includes('%percentage%') && data?.percentage ? key.replace('%percentage%', data.percentage) : key
}

describe('limitOrders/utils/getRatePercentageMessage', () => {
  describe.each([
    [
      getRatePercentageDifference(SEVEN_BUSD_PER_CAKE, ELEVEN_BUSD_PER_CAKE),
      ['57.14% above market', PercentageDirection.ABOVE],
    ],
    [
      getRatePercentageDifference(SEVEN_BUSD_PER_CAKE, FIVE_BUSD_PER_CAKE),
      ['-28.57% below market', PercentageDirection.BELOW],
    ],
    [
      getRatePercentageDifference(SEVEN_BUSD_PER_CAKE, SEVEN_HUNDRED_BUSD_PER_CAKE),
      ['9,900% above market', PercentageDirection.ABOVE],
    ],
    [
      getRatePercentageDifference(SEVEN_BUSD_PER_CAKE, ONE_BUSD_PER_CAKE),
      ['-85.71% below market', PercentageDirection.BELOW],
    ],
    [
      getRatePercentageDifference(SEVEN_BUSD_PER_CAKE, SEVEN_BUSD_PER_CAKE),
      ['at market price', PercentageDirection.MARKET],
    ],
  ])('returns correct message and direction', (percent, expected) => {
    it(`for ${percent?.toSignificant(6)} Percent`, () => {
      const [message, direction] = getRatePercentageMessage(mockT, percent)
      expect(message).toBe(expected[0])
      expect(direction).toBe(expected[1])
    })
  })
})
