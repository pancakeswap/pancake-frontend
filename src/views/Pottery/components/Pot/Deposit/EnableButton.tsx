import { Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const EnableButton: React.FC = () => {
  const { t } = useTranslation()

  return <Button>{t('Enable')}</Button>
}

export default EnableButton
