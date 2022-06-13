import { Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const DepositButton: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Button width="100%" mt="10px">
      {t('Deposit CAKE')}
    </Button>
  )
}

export default DepositButton
