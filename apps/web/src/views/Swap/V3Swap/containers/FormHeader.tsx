import { FC, useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'

import CurrencyInputHeader from '../../components/CurrencyInputHeader'

interface Props {
  refreshDisabled: boolean
  onRefresh: () => void
}

export const FormHeader: FC<Props> = ({ refreshDisabled, onRefresh }) => {
  const { t } = useTranslation()
  const handleRefresh = useCallback(() => {
    if (refreshDisabled) {
      return
    }
    onRefresh()
  }, [onRefresh, refreshDisabled])

  return (
    <CurrencyInputHeader
      title={t('Swap')}
      subtitle={t('Trade tokens in an instant')}
      hasAmount={!refreshDisabled}
      onRefreshPrice={handleRefresh}
    />
  )
}
