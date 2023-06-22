import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'

export function NewIconButton() {
  const { t } = useTranslation()
  return (
    <Button height="25px" width="20px" variant="secondary">
      {t('New')}
    </Button>
  )
}
