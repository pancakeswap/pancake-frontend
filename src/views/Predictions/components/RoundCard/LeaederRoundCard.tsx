import React from 'react'
import styled from 'styled-components'
import { Box, CardBody, Flex, LinkExternal, PlayCircleOutlineIcon, Text, useTooltip } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Round, BetPosition } from 'state/types'
import { useBlock, useGetIntervalBlocks } from 'state/hooks'
import { useBnbUsdtTicker } from 'hooks/ticker'
import BlockProgress from 'components/BlockProgress'
import { formatUsd, getBubbleGumBackground } from '../../helpers'
import PositionTag from '../PositionTag'
import { RoundResultBox, LockPriceRow, PrizePoolRow, RoundResult } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import CanceledRoundCard from './CanceledRoundCard'
import CalculatingCard from './CalculatingCard'

interface LiveRoundCardProps {
  bid: any
}

const GradientCard = styled(Card)`
  background: ${({ theme }) => getBubbleGumBackground(theme)};
`

const LeaederRoundCard: React.FC<LiveRoundCardProps> = ({
  bid
}) => {
  const { t } = useTranslation()
  // const { lockPrice, lockBlock, totalAmount } = round
  const { stream } = useBnbUsdtTicker()
  const { currentBlock } = useBlock()
  const totalInterval = useGetIntervalBlocks()

  const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

  const tooltipContent = (
    <Box width="256px">
      {t('The final price at the end of a round may be different from the price shown on the live feed.')}
      <LinkExternal href="https://docs.pancakeswap.finance/products/prediction" mt="8px">
        {t('Learn More')}
      </LinkExternal>
    </Box>
  )

  return (
      <StyledExpiredRoundCard>
        <CardHeader
          status="outbid"
          icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
          title={t('Leader')}
          bid={bid}
        />
        <CardBody p="16px" style={{ position: 'relative' }}>
          <RoundResult bid={bid} />
        </CardBody>
      </StyledExpiredRoundCard>
  )
}

export default LeaederRoundCard
