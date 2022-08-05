import { useTranslation } from '@pancakeswap/localization'
import { ContextData, TranslationKey } from '@pancakeswap/localization/types'

export interface TransProps extends ContextData {
  children: TranslationKey
}

const Trans = ({ children, ...props }: TransProps) => {
  const { t } = useTranslation()
  if (typeof children !== 'string') {
    throw new Error('children not string in Trans is not supported yet')
  }
  return <>{t(children, props)}</>
}

export default Trans
