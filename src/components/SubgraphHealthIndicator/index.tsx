import { BSC_BLOCK_TIME } from 'config'
import { useTranslation } from 'contexts/Localization'
import { Translate } from 'contexts/Localization/types'
import React from 'react'
import styled from 'styled-components'
import { Card, Box, InfoIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useSubgraphHealthIndicatorManager } from 'state/user/hooks'
import useSubgraphHealth, { SubgraphStatus } from 'hooks/useSubgraphHealth'
import { useLocation } from 'react-router-dom'

const StyledCard = styled(Card)`
  border-radius: 8px;
  > div {
    border-radius: 8px;
  }
`

const IndicatorWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 7px;
`

const Dot = styled(Box)<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color, theme }) => theme.colors[$color]};
`

const indicator = (t: Translate) =>
  ({
    delayed: {
      label: t('Delayed'),
      color: 'failure',
      description: t(
        'Subgraph is currently experiencing delays due to BSC issues. Performance may suffer until subgraph is restored.',
      ),
    },
    slow: {
      label: t('Slight delay'),
      color: 'warning',
      description: t(
        'Subgraph is currently experiencing delays due to BSC issues. Performance may suffer until subgraph is restored.',
      ),
    },
    healthy: {
      label: t('Fast'),
      color: 'success',
      description: t('No issues with the subgraph.'),
    },
  } as const)

type Indicator = keyof ReturnType<typeof indicator>

const getIndicator = (sgStatus: SubgraphStatus): Indicator => {
  if (sgStatus === SubgraphStatus.WARNING) {
    return 'delayed'
  }

  if (sgStatus === SubgraphStatus.NOT_OK) {
    return 'slow'
  }

  return 'healthy'
}

export interface BlockResponse {
  blocks: {
    number: string
  }[]
}

const SubgraphHealthIndicator = () => {
  const { pathname } = useLocation()
  const isOnNftPages = pathname.includes('nfts')
  return isOnNftPages ? <SubgraphHealth /> : null
}

const SubgraphHealth = () => {
  const { t } = useTranslation()
  const { status, currentBlock, blockDifference, latestBlock } = useSubgraphHealth()
  const [alwaysShowIndicator] = useSubgraphHealthIndicatorManager()
  const forceIndicatorDisplay = status === SubgraphStatus.WARNING || status === SubgraphStatus.NOT_OK
  const showIndicator = alwaysShowIndicator || forceIndicatorDisplay

  const indicatorProps = indicator(t)

  const secondRemainingBlockSync = blockDifference * BSC_BLOCK_TIME

  const indicatorValue = getIndicator(status)

  const current = indicatorProps[indicatorValue]

  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <TooltipContent
      currentBlock={currentBlock}
      secondRemainingBlockSync={secondRemainingBlockSync}
      blockNumberFromSubgraph={latestBlock}
      {...current}
    />,
    {
      placement: 'top',
    },
  )

  if (!latestBlock || !currentBlock || !showIndicator) {
    return null
  }

  return (
    <Box position="fixed" bottom="55px" right="5%" ref={targetRef}>
      {tooltipVisible && tooltip}
      <StyledCard>
        <IndicatorWrapper p="10px">
          <Dot $color={current.color} />
          <Text>{current.label}</Text>
          <InfoIcon />
        </IndicatorWrapper>
      </StyledCard>
    </Box>
  )
}

const TooltipContent = ({
  color,
  label,
  description,
  currentBlock,
  secondRemainingBlockSync,
  blockNumberFromSubgraph,
}) => {
  const { t } = useTranslation()
  return (
    <Box>
      <IndicatorWrapper pb="10px">
        <Dot $color={color} />
        <Text>{label}</Text>
      </IndicatorWrapper>
      <Text pb="24px">{description}</Text>
      <Text>
        <strong>{t('Chain Head Block')}:</strong> {currentBlock}
      </Text>
      <Text>
        <strong>{t('Latest Subgraph Block')}:</strong> {blockNumberFromSubgraph}
      </Text>
      <Text>
        <strong>{t('Delay')}:</strong> {currentBlock - blockNumberFromSubgraph} ({secondRemainingBlockSync}s)
      </Text>
    </Box>
  )
}

export default SubgraphHealthIndicator
