import { ReactNode } from 'react'

export interface CardConfigReturn {
  title: string
  variant: 'blue' | 'violet'
  tooltip: string | ReactNode
}
