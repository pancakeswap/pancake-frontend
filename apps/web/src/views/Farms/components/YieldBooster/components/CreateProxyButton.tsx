import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, ButtonProps, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useBCakeFarmBoosterProxyFactoryContract } from 'hooks/useContract'
import { memo, useState } from 'react'

const MAX_GAS_LIMIT = 2500000

interface CreateProxyButtonProps extends ButtonProps {
  onDone?: () => void
}

const CreateProxyButton: React.FC<React.PropsWithChildren<CreateProxyButtonProps>> = ({ onDone, ...props }) => {
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
          onDone?.()
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
