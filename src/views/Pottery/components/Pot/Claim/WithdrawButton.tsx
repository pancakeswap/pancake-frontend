import { useTranslation } from 'contexts/Localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useWithdrawPottery } from 'views/Pottery/hooks/useWithdrawPottery'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'

interface WithdrawButtonProps {
  cakeNumber: BigNumber
  redeemShare: string
  potteryVaultAddress: string
  balanceOf: string
}

const WithdrawButton: React.FC<WithdrawButtonProps> = ({ cakeNumber, redeemShare, potteryVaultAddress, balanceOf }) => {
  const { t } = useTranslation()
  const { isPending, handleWithdraw } = useWithdrawPottery(redeemShare, potteryVaultAddress)

  const isDisabled = useMemo(() => {
    return isPending || cakeNumber.lte(0) || cakeNumber.isNaN() || new BigNumber(balanceOf).lte(0)
  }, [isPending, cakeNumber, balanceOf])

  return (
    <Button
      width={['110px', '110px', '162px']}
      ml="auto"
      variant="secondary"
      disabled={isDisabled}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleWithdraw}
    >
      {t('Withdraw')}
    </Button>
  )
}

export default WithdrawButton
