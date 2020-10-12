import React from 'react'
import { TranslateString } from '../../utils/translateTextHelpers'

export interface TranslatedTextProps {
  translationId: number
  children: string
}

const TranslatedText = ({ translationId, children }: TranslatedTextProps) => {
  return <>{TranslateString(translationId, children)}</>
}

export default TranslatedText
