import farms56 from '@pancakeswap/farms/constants/56'
import farms1 from '@pancakeswap/farms/constants/1'
import { SerializedFarm } from 'state/types'
import { getLpContract } from 'utils/contractHelpers'
import { ChainId } from '@pancakeswap/sdk'
import { SerializedFarmConfig } from '@pancakeswap/farms'

// Test only against the last 10 farms, for performance concern
const farmsToTest: [number, SerializedFarm, number][] = farms56
  .filter((farm) => farm.pid !== 0 && farm.pid !== null)
  .filter((farm) => !farm.stableSwapAddress)
  .slice(0, 10)
  .map((farm) => [farm.pid, farm, 56])

const farms1ToTest: [number, SerializedFarm, number][] = farms1.slice(0, 10).map((farm) => [farm.pid, farm, 1])

let logged = false
export const getFarmConfig = async (chainId: ChainId) => {
  try {
    return (await import(`../../../packages/farms/constants/${chainId}`)).default.filter(
      (f: SerializedFarmConfig) => f.pid !== null,
    ) as SerializedFarmConfig[]
  } catch (error) {
    if (!logged) {
      console.error('Cannot get farm config', error, chainId)
      logged = true
    }
    return []
  }
}

describe('Config farms', () => {
  it.each([...farmsToTest, ...farms1ToTest])('Farm #%d has an unique pid', async (pid, farm, chainId) => {
    const farmConfig = await getFarmConfig(chainId)
    const duplicates = farmConfig.filter((f) => pid === f.pid)
    expect(duplicates).toHaveLength(1)
  })

  it.each([...farmsToTest, ...farms1ToTest])('Farm #%d has an unique address', async (pid, farm, chainId) => {
    const farmConfig = await getFarmConfig(chainId)
    const duplicates = farmConfig.filter((f) => farm.lpAddress === f.lpAddress)
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
