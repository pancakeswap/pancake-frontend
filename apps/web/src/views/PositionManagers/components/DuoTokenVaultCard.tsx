/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from '@pancakeswap/position-managers'
import { Currency } from '@pancakeswap/sdk'
import { ReactNode, memo } from 'react'

interface Props {
  currencyA: Currency
  currencyB: Currency
  name: string

  autoCompound?: boolean
  strategy: Strategy
  manager?: ReactNode
  info?: ReactNode
}

export const DuoTokenVaultCard = memo(function DuoTokenVaultCard() {
  return null
})
