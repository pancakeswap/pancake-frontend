import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useDepositPottery } from 'views/Pottery/hooks/useDepositPottery'
import { PotteryDepositStatus } from 'state/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

interface DepositButtonProps {
  status: PotteryDepositStatus
  depositAmount: string
  potteryVaultAddress: string
  setDepositAmount: (value: string) => void
}

const DepositButton: React.FC<React.PropsWithChildren<DepositButtonProps>> = ({
  status,
  depositAmount,
  potteryVaultAddress,
  setDepositAmount,
}) => {
  const { t } = useTranslation()
  const { isPending, handleDeposit } = useDepositPottery(depositAmount, potteryVaultAddress)
  const depositAmountAsBN = new BigNumber(depositAmount).multipliedBy(DEFAULT_TOKEN_DECIMAL)

  const onClickDeposit = useCallback(async () => {
    await handleDeposit()
    setDepositAmount('')
  }, [handleDeposit, setDepositAmount])

  return (
    <Button
      mt="10px"
      width="100%"
      isLoading={isPending}
      disabled={status !== PotteryDepositStatus.BEFORE_LOCK || depositAmountAsBN.lte(0) || depositAmountAsBN.isNaN()}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={onClickDeposit}
    >
      {t('Deposit CAKE')}
    </Button>
  )
}

export default DepositButton
