import { useCallback } from 'react'
import { useTranslation } from 'contexts/Localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useWeb3React } from '@web3-react/core'

interface DepositButtonProps {
  depositAmount: string
}

const DepositButton: React.FC<DepositButtonProps> = ({ depositAmount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const depositAmountAsBigNumber = new BigNumber(depositAmount).multipliedBy(BIG_TEN.pow(18))

  const handleDeposit = useCallback(async () => {
    // const receipt = await fetchWithCatchTxError(() => contract.release(amountAsBigNumber, account))
    // if (receipt?.status) {
    //   toastSuccess(
    //     t('Success!'),
    //     <ToastDescriptionWithTx txHash={receipt.transactionHash}>
    //       {t('You have successfully claimed available tokens.')}
    //     </ToastDescriptionWithTx>,
    //   )
    //   fetchUserVestingData()
    // }
  }, [account, depositAmountAsBigNumber, t, fetchWithCatchTxError, toastSuccess])

  return (
    <Button
      mt="10px"
      width="100%"
      isLoading={isPending}
      disabled={depositAmountAsBigNumber.lte(0) || depositAmountAsBigNumber.isNaN()}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Deposit CAKE')}
    </Button>
  )
}

export default DepositButton
