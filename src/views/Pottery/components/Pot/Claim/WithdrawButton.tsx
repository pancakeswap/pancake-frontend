import { useTranslation } from 'contexts/Localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useWithdrawPottery } from 'views/Pottery/hooks/useWithdrawPottery'
import BigNumber from 'bignumber.js'

interface WithdrawButtonProps {
  amount: BigNumber
  redeemShare: string
}

const WithdrawButton: React.FC<WithdrawButtonProps> = ({ amount, redeemShare }) => {
  const { t } = useTranslation()
  const { isPending, handleWithdraw } = useWithdrawPottery(redeemShare)

  return (
    <Button
      width="162px"
      ml="auto"
      variant="secondary"
      disabled={isPending || amount.lte(0) || amount.isNaN()}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleWithdraw}
    >
      {t('Withdraw')}
    </Button>
  )
}

export default WithdrawButton
