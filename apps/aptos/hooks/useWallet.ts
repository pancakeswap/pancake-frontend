import { useTranslation } from '@pancakeswap/localization'
import { useWalletModal } from '@pancakeswap/uikit'
import { wallets } from '../config/wallets'
import { useAuth } from './useAuth'

export const useWallet = () => {
  const { t } = useTranslation()
  const { login } = useAuth()

  const { onPresentConnectModal } = useWalletModal(login, t, wallets)

  return { onPresentConnectModal }
}
