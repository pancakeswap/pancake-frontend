import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useState, memo } from 'react'

import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@pancakeswap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useBCakeFarmBoosterProxyFactoryContract } from 'hooks/useContract'

const MAX_GAS_LIMIT = 2500000

const CreateProxyButton = ({ onDone, ...props }) => {
  const { t } = useTranslation()
  const farmBoosterProxyFactoryContract = useBCakeFarmBoosterProxyFactoryContract()
  const [isCreateProxyLoading, setIsCreateProxyLoading] = useState(false)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading } = useCatchTxError()

  return (
    <Button
      width="100%"
      {...props}
      onClick={async () => {
        try {
          setIsCreateProxyLoading(true)
          const receipt = await fetchWithCatchTxError(() =>
            farmBoosterProxyFactoryContract.createFarmBoosterProxy({ gasLimit: MAX_GAS_LIMIT }),
          )
          if (receipt?.status) {
            toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
          }
        } catch (error) {
          console.error(error)
        } finally {
          setIsCreateProxyLoading(false)
          if (onDone) {
            onDone()
          }
        }
      }}
      isLoading={isCreateProxyLoading || loading}
      endIcon={isCreateProxyLoading || loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
    >
      {isCreateProxyLoading || loading ? t('Confirming...') : t('Enable')}
    </Button>
  )
}

export default memo(CreateProxyButton)
