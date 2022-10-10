import farms56 from '@pancakeswap/farms/constants/56'
import farms1 from '@pancakeswap/farms/constants/1'
import { Native } from '@pancakeswap/sdk'
import { SerializedFarm } from 'state/types'
import { getLpContract } from 'utils/contractHelpers'

// Test only against the last 10 farms, for performance concern
const farmsToTest: [number, SerializedFarm, number][] = farms56
  .filter((farm) => farm.pid !== 0 && farm.pid !== null)
  .filter((farm) => !farm.stableSwapAddress)
  .slice(0, 10)
  .map((farm) => [farm.pid, farm, 56])

const farms1ToTest: [number, SerializedFarm, number][] = farms1.slice(0, 10).map((farm) => [farm.pid, farm, 1])

describe('Config farms', () => {
  // TODO: will check if pid not in farms56
  // it.each([...farmsToTest, ...farms1ToTest])('Farm #%d has an unique pid', (pid) => {
  //   const duplicates = farms56.filter((f) => pid === f.pid)
  //   expect(duplicates).toHaveLength(1)
  // })

  it.each([...farmsToTest, ...farms1ToTest])('Farm #%d has an unique address', async (pid, farm) => {
    const farms = [...farms56, ...farms1]
    const duplicates = farms.filter((f) => farm.lpAddress === f.lpAddress)
    expect(duplicates).toHaveLength(1)
  })

  it.each([...farmsToTest, ...farms1ToTest])('Farm %d has the correct token addresses', async (pid, farm, chainId) => {
    const tokenAddress = farm.token.address
    const quoteTokenAddress = farm.quoteToken.address
    const lpContract = getLpContract(farm.lpAddress, chainId)

    const token0Address = (await lpContract.token0()).toLowerCase()
    const token1Address = (await lpContract.token1()).toLowerCase()

    expect(
      token0Address === tokenAddress.toLowerCase() || token0Address === quoteTokenAddress.toLowerCase(),
    ).toBeTruthy()
    expect(
      token1Address === tokenAddress.toLowerCase() || token1Address === quoteTokenAddress.toLowerCase(),
    ).toBeTruthy()
  })

  it.each([...farmsToTest, ...farms1ToTest])('Farm %d symbol should not be native symbol', (_, farm, chainId) => {
    const native = Native.onChain(chainId)
    expect(farm.quoteToken.symbol).not.toEqual(native.symbol)
    expect(farm.token.symbol).not.toEqual(native.symbol)
  })

  // TODO: Add test for ETH
  // The first pid using the new factory
  const START_PID = 2
  const FACTORY_ADDRESS = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73'
  const newFarmsToTest = farmsToTest.filter((farmSet) => farmSet[0] >= START_PID)

  it.each(newFarmsToTest)('farm %d is using correct factory address', async (pid, farm) => {
    const lpContract = getLpContract(farm.lpAddress)
    const factory = await lpContract.factory()
    expect(factory.toLowerCase()).toEqual(FACTORY_ADDRESS)
  })
})
