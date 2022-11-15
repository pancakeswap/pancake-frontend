import { describe, it, expect } from 'vitest'
import { ChainId, Pair, Coin } from '@pancakeswap/aptos-swap-sdk'
import { SerializedFarm } from '@pancakeswap/farms'
import farms1 from '../constants/farms/1'
import farms2 from '../constants/farms/2'
import { CAKE_PID } from '../constants/index'

// Test only against the last 10 farms, for performance concern
const mainnetFarmsToTest: [number, SerializedFarm, number][] = farms1
  .filter((farm) => farm.pid !== 0 && farm.pid !== null)
  .slice(0, 10)
  .map((farm) => [farm.pid, farm, ChainId.MAINNET])

const farms2ToTest: [number, SerializedFarm, number][] = farms2
  .filter((farm) => farm.pid !== 0 && farm.pid !== null)
  .slice(0, 10)
  .map((farm) => [farm.pid, farm, ChainId.TESTNET])

const getDuplicates = (key: 'pid' | 'lpAddress') => {
  const farms = [...farms1, ...farms2]
  const keys = farms.map((farm) => farm[key])
  return keys.filter((data) => keys.indexOf(data) !== keys.lastIndexOf(data))
}

describe('Config farms', () => {
  it('All farm has an unique pid', () => {
    const duplicates = getDuplicates('pid')
    expect(duplicates).toHaveLength(0)
  })

  it('All farm has an unique address', () => {
    const duplicates = getDuplicates('lpAddress')
    expect(duplicates).toHaveLength(0)
  })

  it.each([...mainnetFarmsToTest, ...farms2ToTest])('Farm %d has the correct token addresses', async (pid, farm) => {
    const token = new Coin(farm.token.chainId, farm.token.address, farm.token.decimals, farm.token.symbol)
    const quoteToken = new Coin(
      farm.quoteToken.chainId,
      farm.quoteToken.address,
      farm.quoteToken.decimals,
      farm.quoteToken.symbol,
    )

    // Skip CAKE
    if (pid !== CAKE_PID) {
      const reservesAddress = Pair.getReservesAddress(token, quoteToken)
      const lpAddress = Pair.parseType(reservesAddress)
      const token0Address = lpAddress[0].toLowerCase()
      const token1Address = lpAddress[1].toLowerCase()

      expect(token0Address === quoteToken.address.toLowerCase()).toBeTruthy()
      expect(token1Address === token.address.toLowerCase()).toBeTruthy()
    }
  })
})
