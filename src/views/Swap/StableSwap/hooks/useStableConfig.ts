import stableSwapConfigs from 'config/constants/stableSwapConfigs'
import { useContract } from 'hooks/useContract'
import stableSwapABI from 'config/abi/stableSwap.json'

function findStablePair() {
  const stableSwapPair = stableSwapConfigs[0]

  return stableSwapPair
}

export default function useStableConfig({ tokenAAddress, tokenBAddress }) {
  const stablePair = findStablePair()
  const stableSwapContract = useContract(stablePair?.stableSwapAddress, stableSwapABI)

  return {
    stableSwapConfig: stablePair,
    stableSwapContract,
  }
}
