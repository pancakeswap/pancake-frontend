import { ChainId } from '@pancakeswap/sdk'
import { AutoColumn } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import styled from 'styled-components'
import type { ReactNode } from 'react'
import { CHAIN_IDS } from 'utils/wagmi'

export const FEE_AMOUNT_DETAIL: Record<
  FeeAmount,
  { label: string; description: ReactNode; supportedChains: ChainId[] }
> = {
  [FeeAmount.LOWEST]: {
    label: '0.01',
    description: 'Best for very stable pairs.',
    supportedChains: CHAIN_IDS,
  },
  [FeeAmount.LOW]: {
    label: '0.05',
    description: 'Best for stable pairs.',
    supportedChains: CHAIN_IDS,
  },
  [FeeAmount.MEDIUM]: {
    label: '0.3',
    description: 'Best for most pairs.',
    supportedChains: CHAIN_IDS,
  },
  [FeeAmount.HIGH]: {
    label: '1',
    description: 'Best for exotic pairs.',
    supportedChains: CHAIN_IDS,
  },
}

export const DynamicSection = styled(AutoColumn)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')};
  width: 100%;
`

export const SelectContainer = styled.div`
  align-items: flex-start;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 8px;
`
