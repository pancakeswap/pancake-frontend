import BigNumber from 'bignumber.js'
import { BLOCKS_PER_DAY } from 'config'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSWR from 'swr'
import { useStableFarms, useWeb3SwapContract } from 'views/Swap/StableSwap/hooks/useStableConfig'

export default function useBaseAprForStableFarm(farms) {
  const stableFarms = useStableFarms()

  const web3SwapContract = useWeb3SwapContract(stableFarms?.length ? stableFarms[0].stableSwapAddress : null)

  const { provider } = useActiveWeb3React()

  const isStableFarm = (f) => (stableFarms?.length ? stableFarms[0].liquidityToken?.address === f?.lpAddress : false)

  const stableFarm = farms.find(isStableFarm)

  const shouldValidate = stableFarm && provider && web3SwapContract

  const { data: baseApr } = useSWR(shouldValidate ? [stableFarm?.lpAddress, 'get_virtual_price'] : null, async () => {
    const latest = await provider.getBlockNumber()
    const virtualPrice = await web3SwapContract.methods.get_virtual_price().call()
    let preVirtualPrice

    try {
      preVirtualPrice = await web3SwapContract.methods.get_virtual_price().call('', latest - BLOCKS_PER_DAY)
    } catch (e) {
      preVirtualPrice = 1 * 10 ** 18
    }

    const current = new BigNumber(virtualPrice)
    const prev = new BigNumber(preVirtualPrice)

    return current.minus(prev).div(prev)
  })

  return baseApr ? farms.map((f) => (isStableFarm(f) ? { ...f, lpRewardsApr: baseApr } : f)) : farms
}
