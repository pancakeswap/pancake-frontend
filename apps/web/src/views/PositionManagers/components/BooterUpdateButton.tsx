import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'

export const BoosterUpdateButton: React.FC<{ onUpdate: () => void }> = ({ onUpdate }) => {
  const { t } = useTranslation()
  return <Button onClick={onUpdate}>{t('Update')}</Button>
}
