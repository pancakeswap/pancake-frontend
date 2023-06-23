import { FC } from 'react'

import { AppHeader } from 'components/App'

export const FormHeader: FC<{
  title: string
  subTitle: string
  backTo?: any
}> = ({ title, subTitle, backTo }) => {
  return <AppHeader backTo={backTo} shouldCenter title={title} subtitle={subTitle} noConfig />
}
