import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { APTOS_COIN } from 'aptos'
import { APT_INFO } from 'config/coins'
import { useActiveChainId } from './useNetwork'

const cached: Record<number, Coin> = {}

const useNativeCurrency = () => {
  const activeChainId = useActiveChainId()
  if (activeChainId && cached[activeChainId]) {
    return cached[activeChainId]
  }
  cached[activeChainId] = new Coin(activeChainId, APTOS_COIN, APT_INFO.decimal, APT_INFO.symbol, APT_INFO.name)

  return cached[activeChainId]
}

export default useNativeCurrency
