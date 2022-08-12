import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useApprovePottery } from 'views/Pottery/hooks/useApprovePottery'

interface Props {
  potteryVaultAddress: string
}

const EnableButton: React.FC<React.PropsWithChildren<Props>> = ({ potteryVaultAddress }) => {
  const { t } = useTranslation()
  const { isPending, onApprove } = useApprovePottery(potteryVaultAddress)

  return (
    <Button
      width="100%"
      disabled={isPending}
      onClick={onApprove}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Enable')}
    </Button>
  )
}

export default EnableButton
