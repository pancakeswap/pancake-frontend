import { FC } from 'react'
import { useTranslation } from '@pancakeswap/localization'

import CurrencyInputHeader from '../../components/CurrencyInputHeader'

interface Props {
  refreshDisabled: boolean
  onRefresh?: () => void
}

export const FormHeader: FC<Props> = ({
  refreshDisabled,
  onRefresh = () => {
    // default
  },
}) => {
  const { t } = useTranslation()

  return (
    <CurrencyInputHeader
      title={t('Swap')}
      subtitle={t('Trade tokens in an instant')}
      hasAmount={!refreshDisabled}
      onRefreshPrice={onRefresh}
    />
  )
}
