import { ReactElement } from 'react'

export enum EnableStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  IS_ENABLING = 'is_enabling',
}

export interface CardConfigReturn {
  title: string
  variant: 'blue' | 'violet'
  tooltip: string | ReactElement
}

export interface CountdownProps {
  steps?: Array<{ text: string }>
  activeStepIndex?: number
  stepText?: string
  index?: number
}
