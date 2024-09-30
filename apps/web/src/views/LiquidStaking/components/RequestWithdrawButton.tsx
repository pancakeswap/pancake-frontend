import { useTranslation } from '@pancakeswap/localization'
import { Currency, ERC20Token } from '@pancakeswap/sdk'
import { AutoRenewIcon, Button } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useAccount } from 'wagmi'
import { LiquidStakingList } from '../constants/types'
import { useRequestWithdraw } from '../hooks/useRequestWithdraw'

interface RequestWithdrawButtonProps {
  inputCurrency: Currency | ERC20Token
  currentAmount: BigNumber
  selectedList: LiquidStakingList
}

export function RequestWithdrawButton({ inputCurrency, currentAmount, selectedList }: RequestWithdrawButtonProps) {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const { loading, requestWithdraw } = useRequestWithdraw({
    inputCurrency,
    currentAmount,
    selectedList,
  })

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  return (
    <Button
      width="100%"
      endIcon={loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
      isLoading={loading}
      disabled={currentAmount.eq(0)}
      onClick={requestWithdraw}
    >
      {loading ? `${t('Requesting')}` : t('Request')}
    </Button>
  )
}
