import { FC } from 'react'
import { AppHeader } from 'components/App'

export const FormHeader: FC<{
  title: string
  subTitle: string
  shouldCenter?: boolean
  backTo?: any
}> = ({ title, subTitle, shouldCenter = false, backTo }) => {
  return (
    <AppHeader backTo={backTo} title={title} subtitle={subTitle} shouldCenter={shouldCenter} borderHidden noConfig />
  )
}
