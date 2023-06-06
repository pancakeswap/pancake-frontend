import { FC } from 'react'

import { AppHeader } from 'components/App'

export const FormHeader: FC<{
  refreshDisabled?: boolean
  onRefresh?: () => void
  title: string
  subTitle: string
  backTo?: any
}> = ({ title, subTitle, backTo }) => {
  // const { t } = useTranslation()

  // const handleRefresh = useCallback(() => {
  //   if (refreshDisabled) {
  //     return
  //   }
  //   onRefresh()
  // }, [onRefresh, refreshDisabled])

  return <AppHeader backTo={backTo} shouldCenter title={title} subtitle={subTitle} noConfig />
}
