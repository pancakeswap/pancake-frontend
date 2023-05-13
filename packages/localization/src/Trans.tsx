import { createElement, Fragment } from 'react'
import { ContextData, TranslationKey } from './types'
import useTranslation from './useTranslation'

export interface TransProps extends ContextData {
  children: TranslationKey
}

export const Trans = ({ children, ...props }: TransProps) => {
  const { t } = useTranslation()
  if (typeof children !== 'string') {
    throw new Error('children not string in Trans is not supported yet')
  }
  return createElement(Fragment, {}, t(children, props))
}
