import { AutoColumn, Text } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { LightGreyCard } from 'components/Card'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import styled from 'styled-components'

import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'

const FeeOptionContainer = styled(LightGreyCard)<{ active: boolean }>`
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  border: ${({ active, theme }) => `1px solid ${active ? theme.colors.secondary : theme.colors.cardBorder}`};
`

interface FeeOptionProps {
  feeAmount: FeeAmount
  active: boolean
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
  onClick: () => void
}

export function FeeOption({ feeAmount, active, poolState, distributions, onClick }: FeeOptionProps) {
  return (
    <FeeOptionContainer padding="8px" active={active} onClick={onClick}>
      <AutoColumn gap="sm" justify="flex-start">
        <AutoColumn justify="flex-start">
          <Text>{FEE_AMOUNT_DETAIL[feeAmount].label}%</Text>
        </AutoColumn>

        {distributions && (
          <FeeTierPercentageBadge distributions={distributions} feeAmount={feeAmount} poolState={poolState} />
        )}
      </AutoColumn>
    </FeeOptionContainer>
  )
}
