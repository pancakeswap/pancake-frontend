import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useState } from 'react'

import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from 'contexts/Localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useBCakeFarmBoosterProxyFactoryContract } from 'hooks/useContract'

const CreateProxyButton = (props) => {
  const { t } = useTranslation()
  const farmBoosterProxyFactoryContract = useBCakeFarmBoosterProxyFactoryContract()
  const [isCreateProxyLoading, setIsCreateProxyLoading] = useState(false)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading } = useCatchTxError()

  return (
    <Button
      {...props}
      onClick={async () => {
        try {
          setIsCreateProxyLoading(true)
          const receipt = await fetchWithCatchTxError(() => farmBoosterProxyFactoryContract.createFarmBoosterProxy())
          if (receipt?.status) {
            toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
          }
        } catch (error) {
          console.error(error)
        } finally {
          setIsCreateProxyLoading(false)
          if (props.onDone) {
            props.onDone()
          }
        }
      }}
      isLoading={isCreateProxyLoading || loading}
      width="100%"
      endIcon={isCreateProxyLoading || loading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
    >
      {isCreateProxyLoading || loading ? t('Confirming...') : t('Enable')}
    </Button>
  )
}

export default CreateProxyButton
