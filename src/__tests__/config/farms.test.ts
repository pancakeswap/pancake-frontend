import farms from 'config/constants/farms'
import { getBep20Contract, getLpContract } from 'utils/contractHelpers'

const farmsToTest = farms.filter((farm) => farm.pid !== 0)

describe('Config farms', () => {
  it.each(farms.map((farm) => farm.pid))('Farm #%d has an unique pid', (pid) => {
    const duplicates = farms.filter((f) => pid === f.pid)
    expect(duplicates).toHaveLength(1)
  })
  it.each(farms.map((farm) => [farm.pid, farm.lpAddresses]))('Farm #%d has an unique address', (pid, lpAddresses) => {
    const duplicates = farms.filter((f) => lpAddresses[56] === f.lpAddresses[56])
    expect(duplicates).toHaveLength(1)
  })
  it.each(farmsToTest)('Farm %p has the correct token addresses', async (farm) => {
    const tokenAddress = farm.token.address[56]
    const quoteTokenAddress = farm.quoteToken.address[56]
    const lpContract = getLpContract(farm.lpAddresses[56])

    const token0Address = (await lpContract.methods.token0().call()).toLowerCase()
    const token1Address = (await lpContract.methods.token1().call()).toLowerCase()

    expect(
      token0Address === tokenAddress.toLowerCase() || token0Address === quoteTokenAddress.toLowerCase(),
    ).toBeTruthy()
    expect(
      token1Address === tokenAddress.toLowerCase() || token1Address === quoteTokenAddress.toLowerCase(),
    ).toBeTruthy()
  })
  it.each(farmsToTest)('Farm %p has non 0 tokens amount', async (farm) => {
    const tokenContract = getBep20Contract(farm.token.address[56])
    const quoteTokenContract = getBep20Contract(farm.quoteToken.address[56])

    const tokenAmount = await tokenContract.methods.balanceOf(farm.lpAddresses[56]).call()
    const quoteTokenAmount = await quoteTokenContract.methods.balanceOf(farm.lpAddresses[56]).call()

    expect(parseInt(tokenAmount, 10)).toBeGreaterThan(0)
    expect(parseInt(quoteTokenAmount, 10)).toBeGreaterThan(0)
  })
})
