import farms from 'config/constants/farms'
import { SerializedFarm } from 'state/types'
import { getLpContract } from 'utils/contractHelpers'

// Test only against the last 10 farms, for performance concern
const farmsToTest: [number, SerializedFarm][] = farms
  .filter((farm) => farm.pid !== 0)
  .slice(0, 10)
  .map((farm) => [farm.pid, farm])

describe('Config farms', () => {
  it.each(farmsToTest)('Farm #%d has an unique pid', (pid) => {
    const duplicates = farms.filter((f) => pid === f.pid)
    expect(duplicates).toHaveLength(1)
  })

  it.each(farmsToTest)('Farm #%d has an unique address', (pid, farm) => {
    const duplicates = farms.filter((f) => farm.lpAddresses[56] === f.lpAddresses[56])
    expect(duplicates).toHaveLength(1)
  })

  it.each(farmsToTest)('Farm %d has the correct token addresses', async (pid, farm) => {
    const tokenAddress = farm.token.address
    const quoteTokenAddress = farm.quoteToken.address
    const lpContract = getLpContract(farm.lpAddresses[56])

    const token0Address = (await lpContract.token0()).toLowerCase()
    const token1Address = (await lpContract.token1()).toLowerCase()

    expect(
      token0Address === tokenAddress.toLowerCase() || token0Address === quoteTokenAddress.toLowerCase(),
    ).toBeTruthy()
    expect(
      token1Address === tokenAddress.toLowerCase() || token1Address === quoteTokenAddress.toLowerCase(),
    ).toBeTruthy()
  })

  // The first pid using the new factory
  const START_PID = 365
  const FACTORY_ADDRESS = '0xca143ce32fe78f1f7019d7d551a6402fc5350c73'
  const newFarmsToTest = farmsToTest.filter((farmSet) => farmSet[0] >= START_PID)

  it.each(newFarmsToTest)('farm %d is using correct factory address', async (pid, farm) => {
    const lpContract = getLpContract(farm.lpAddresses[56])
    const factory = await lpContract.factory()
    expect(factory.toLowerCase()).toEqual(FACTORY_ADDRESS)
  })
})
