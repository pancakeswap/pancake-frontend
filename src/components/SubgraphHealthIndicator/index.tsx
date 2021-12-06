import { BSC_BLOCK_TIME } from 'config'
import { BLOCKS_CLIENT } from 'config/constants/endpoints'
import { useTranslation } from 'contexts/Localization'
import { Translate } from 'contexts/Localization/types'
import { request, gql } from 'graphql-request'
import useInterval from 'hooks/useInterval'
import React, { useMemo } from 'react'
import { useBlock } from 'state/block/hooks'
import styled from 'styled-components'
import { Card, Box, InfoIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useSubgraphHealthIndicatorManager } from 'state/user/hooks'

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

const SECOND_IN_DELAY = 900 // 15 minutes
const SECOND_IN_SLIGHTLY_DELAY = 300 // 5 minutes

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

const getIndicator = (secondRemains: number): Indicator => {
  if (secondRemains > SECOND_IN_DELAY) {
    return 'delayed'
  }

  if (secondRemains > SECOND_IN_SLIGHTLY_DELAY) {
    return 'slow'
  }

  return 'healthy'
}

export interface BlockResponse {
  blocks: {
    number: string
  }[]
}
const getBlockFromTheGraph = async () => {
  try {
    const { blocks } = await request<BlockResponse>(
      BLOCKS_CLIENT,
      gql`
        {
          blocks(first: 1, orderDirection: desc, orderBy: number) {
            number
          }
        }
      `,
    )
    return parseInt(blocks[0].number, 10)
  } catch (error) {
    console.error(`Failed to fetch block number from subgraph \n${error}`)
    return null
  }
}

const SubgraphHealthIndicator = () => {
  const [show] = useSubgraphHealthIndicatorManager()

  return show ? <SubgraphHealth /> : null
}

const SubgraphHealth = () => {
  const [blockNumberFromSubgraph, setBlockNumberFromSubgraph] = React.useState<number | null>()
  const { currentBlock } = useBlock()
  const { t } = useTranslation()
  const indicatorProps = useMemo(() => indicator(t), [t])

  useInterval(
    async () => {
      const blockNumber = await getBlockFromTheGraph()
      setBlockNumberFromSubgraph(blockNumber)
    },
    6000,
    true,
  )

  const secondRemainingBlockSync = (currentBlock - blockNumberFromSubgraph) * BSC_BLOCK_TIME

  const indicatorValue = getIndicator(secondRemainingBlockSync)

  const current = indicatorProps[indicatorValue]

  const { targetRef, tooltipVisible, tooltip } = useTooltip(
    <TooltipContent
      currentBlock={currentBlock}
      secondRemainingBlockSync={secondRemainingBlockSync}
      blockNumberFromSubgraph={blockNumberFromSubgraph}
      {...current}
    />,
    {
      placement: 'top',
    },
  )

  if (!blockNumberFromSubgraph || !currentBlock) {
    return null
  }

  return (
    <Box position="fixed" bottom="17px" right="20px" ref={targetRef}>
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
        <strong>{t('Latest Subgraph Block')}:</strong>
        {blockNumberFromSubgraph}
      </Text>
      <Text>
        <strong>{t('Delay')}:</strong> {currentBlock - blockNumberFromSubgraph} ({secondRemainingBlockSync}s)
      </Text>
    </Box>
  )
}

export default SubgraphHealthIndicator
