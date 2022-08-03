import { BSC_BLOCK_TIME } from 'config'
import { useTranslation } from 'contexts/Localization'
import { TranslateFunction } from 'contexts/Localization/types'
import styled from 'styled-components'
import { Card, Flex, Box, InfoIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useSubgraphHealthIndicatorManager } from 'state/user/hooks'
import useSubgraphHealth, { SubgraphStatus } from 'hooks/useSubgraphHealth'

const StyledCard = styled(Card)`
  border-radius: 8px;
  > div {
    border-radius: 8px;
  }
  user-select: none;
`

const IndicatorWrapper = styled(Flex)`
  gap: 7px;
`

const Dot = styled(Box)<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color, theme }) => theme.colors[$color]};
`

interface CustomDescriptions {
  delayed: string
  slow: string
  healthy: string
}

const indicator = (t: TranslateFunction, customDescriptions?: CustomDescriptions) =>
  ({
    delayed: {
      label: t('Delayed'),
      color: 'failure',
      description:
        customDescriptions?.delayed ??
        t(
          'Subgraph is currently experiencing delays due to BSC issues. Performance may suffer until subgraph is restored.',
        ),
    },
    slow: {
      label: t('Slight delay'),
      color: 'warning',
      description:
        customDescriptions?.slow ??
        t(
          'Subgraph is currently experiencing delays due to BSC issues. Performance may suffer until subgraph is restored.',
        ),
    },
    healthy: {
      label: t('Fast'),
      color: 'success',
      description: customDescriptions?.healthy ?? t('No issues with the subgraph.'),
    },
  } as const)

type Indicator = keyof ReturnType<typeof indicator>

const getIndicator = (sgStatus: SubgraphStatus): Indicator => {
  if (sgStatus === SubgraphStatus.NOT_OK) {
    return 'delayed'
  }

  if (sgStatus === SubgraphStatus.WARNING) {
    return 'slow'
  }

  return 'healthy'
}

export interface BlockResponse {
  blocks: {
    number: string
  }[]
}

const SubgraphHealthIndicator: React.FC<{
  subgraphName: string
  inline?: boolean
  customDescriptions?: CustomDescriptions
  obeyGlobalSetting?: boolean
}> = ({ subgraphName, inline, customDescriptions, obeyGlobalSetting }) => {
  const { t } = useTranslation()
  const { status, currentBlock, blockDifference, latestBlock } = useSubgraphHealth(subgraphName)
  const [alwaysShowIndicator] = useSubgraphHealthIndicatorManager()
  const forceIndicatorDisplay = status === SubgraphStatus.WARNING || status === SubgraphStatus.NOT_OK
  const showIndicator = (obeyGlobalSetting && alwaysShowIndicator) || forceIndicatorDisplay

  const indicatorProps = indicator(t, customDescriptions)

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

  if (inline) {
    return (
      <IndicatorWrapper alignItems="center" justifyContent="flex-end" ref={targetRef}>
        <Dot $color={current.color} />
        <Text>{current.label}</Text>
        <InfoIcon />
        {tooltipVisible && tooltip}
      </IndicatorWrapper>
    )
  }

  return (
    <Box position="fixed" bottom="55px" right="5%" ref={targetRef} data-test="subgraph-health-indicator">
      {tooltipVisible && tooltip}
      <StyledCard>
        <IndicatorWrapper alignItems="center" p="10px">
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
