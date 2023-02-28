import { AutoColumn, promotedGradient, Text } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { LightTertiaryCard } from 'components/Card'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import styled, { css } from 'styled-components'

import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'

const FeeOptionContainer = styled.div<{ active: boolean }>`
  cursor: pointer;
  animation: ${promotedGradient} 4s ease infinite;
  background-size: 400% 400%;
  ${({ active }) =>
    active &&
    css`
      background-image: ${({ theme }) => theme.colors.gradientBold};
    `}
  border-radius: 16px;
  padding: 2px;
  &:hover {
    opacity: 0.7;
  }
`

interface FeeOptionProps {
  feeAmount: FeeAmount
  largestUsageFeeTier?: FeeAmount
  active: boolean
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
  onClick: () => void
}

export function FeeOption({
  feeAmount,
  active,
  poolState,
  distributions,
  onClick,
  largestUsageFeeTier,
}: FeeOptionProps) {
  return (
    <FeeOptionContainer active={active} onClick={onClick}>
      <LightTertiaryCard padding="8px">
        <AutoColumn gap="sm" justify="flex-start">
          <AutoColumn justify="flex-start">
            <Text>
              {FEE_AMOUNT_DETAIL[feeAmount].label}% {feeAmount === largestUsageFeeTier && '🔥'}
            </Text>
          </AutoColumn>

          {distributions && (
            <FeeTierPercentageBadge distributions={distributions} feeAmount={feeAmount} poolState={poolState} />
          )}
        </AutoColumn>
      </LightTertiaryCard>
    </FeeOptionContainer>
  )
}
