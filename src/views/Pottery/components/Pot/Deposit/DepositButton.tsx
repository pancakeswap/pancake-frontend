import { useTranslation } from 'contexts/Localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { useDepositPottery } from 'views/Pottery/hooks/useDepositPottery'

interface DepositButtonProps {
  depositAmount: string
}

const DepositButton: React.FC<DepositButtonProps> = ({ depositAmount }) => {
  const { t } = useTranslation()
  const { isPending, handleDeposit } = useDepositPottery(depositAmount)
  const depositAmountAsBN = new BigNumber(depositAmount).multipliedBy(BIG_TEN.pow(18))

  return (
    <Button
      mt="10px"
      width="100%"
      isLoading={isPending}
      disabled={depositAmountAsBN.lte(0) || depositAmountAsBN.isNaN()}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleDeposit}
    >
      {t('Deposit CAKE')}
    </Button>
  )
}

export default DepositButton
