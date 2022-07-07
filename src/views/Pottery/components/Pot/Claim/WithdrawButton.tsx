import { useTranslation } from 'contexts/Localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useWithdrawPottery } from 'views/Pottery/hooks/useWithdrawPottery'
import BigNumber from 'bignumber.js'

interface WithdrawButtonProps {
  cakeNumber: BigNumber
  redeemShare: string
  potteryVaultAddress: string
}

const WithdrawButton: React.FC<WithdrawButtonProps> = ({ cakeNumber, redeemShare, potteryVaultAddress }) => {
  const { t } = useTranslation()
  const { isPending, handleWithdraw } = useWithdrawPottery(redeemShare, potteryVaultAddress)

  return (
    <Button
      width="162px"
      ml="auto"
      variant="secondary"
      disabled={isPending || cakeNumber.lte(0) || cakeNumber.isNaN()}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleWithdraw}
    >
      {t('Withdraw')}
    </Button>
  )
}

export default WithdrawButton
