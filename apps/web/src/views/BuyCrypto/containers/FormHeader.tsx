import { AppHeader } from 'components/App'
import { FC } from 'react'

export const FormHeader: FC<{
  title: string
  subTitle?: string
  shouldCenter?: boolean
  backTo?: any
  borderHidden?: boolean
}> = ({ title, subTitle, shouldCenter = false, backTo, borderHidden = true }) => {
  return (
    <AppHeader
      backTo={backTo}
      title={title}
      subtitle={subTitle}
      shouldCenter={shouldCenter}
      borderHidden={borderHidden}
      noConfig
    />
  )
}
