import { useIsomorphicEffect } from '@pancakeswap/uikit'
import { logWeb3WalletViews } from 'utils/customGTMEventTracking'

export const useWeb3WalletView = () => {
  useIsomorphicEffect(() => {
    // @ts-ignore
    if (window?.ethereum?.isBinance) logWeb3WalletViews()
  }, [])
}
