import { MouseEvent, ReactNode } from 'react'

export type AlertTheme = {
  background: string
}

export const variants = {
  INFO: 'info',
  DANGER: 'danger',
  SUCCESS: 'success',
  WARNING: 'warning',
} as const

export type Variants = typeof variants[keyof typeof variants]

export interface AlertProps {
  variant?: Variants
  title: string
  children?: ReactNode
  onClick?: (evt: MouseEvent<HTMLButtonElement>) => void
}
