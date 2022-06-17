import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useApprovePottery } from 'views/Pottery/hooks/useApprovePottery'

const EnableButton: React.FC = () => {
  const { t } = useTranslation()
  const { isPending, onApprove } = useApprovePottery()

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
