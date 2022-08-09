import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useExtendEnable } from '../hooks/useExtendEnable'

interface ExtendEnableProps {
  isValidAmount: boolean
  isValidDuration: boolean
}

const ExtendEnable: React.FC<ExtendEnableProps> = ({ isValidAmount, isValidDuration }) => {
  const { t } = useTranslation()

  const { handleEnable, pendingEnableTx } = useExtendEnable()

  return (
    <Button
      width="100%"
      isLoading={pendingEnableTx}
      endIcon={pendingEnableTx ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleEnable}
      disabled={!(isValidAmount && isValidDuration)}
    >
      {pendingEnableTx ? t('Enabling') : t('Enable')}
    </Button>
  )
}

export default ExtendEnable
