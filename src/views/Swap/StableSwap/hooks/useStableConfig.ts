import stableSwapConfigs from 'config/constants/stableSwapConfigs'
import { useContract } from 'hooks/useContract'
import stableSwapABI from 'config/abi/stableSwap.json'

function findStablePair({ tokenAAddress, tokenBAddress }) {
  const stableSwapPair = stableSwapConfigs.find((stablePair) => {
    return (
      (stablePair?.token0?.address === tokenAAddress && stablePair?.token1?.address === tokenBAddress) ||
      (stablePair?.token1?.address === tokenAAddress && stablePair?.token0?.address === tokenBAddress)
    )
  })

  return stableSwapPair
}

export default function useStableConfig({ tokenAAddress, tokenBAddress }) {
  const stablePair = findStablePair({ tokenAAddress, tokenBAddress })
  const stableSwapContract = useContract(stablePair?.stableSwapAddress, stableSwapABI)

  return {
    stableSwapConfig: stablePair,
    stableSwapContract,
  }
}
