import React from 'react'
import { CardBody, Text, Flex, BlockIcon, Link, InfoIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { useGetTotalIntervalBlocks } from 'state/hooks'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'

interface CanceledRoundCardProps {
  round: Round
}

const CanceledRoundCard: React.FC<CanceledRoundCardProps> = ({ round }) => {
  const TranslateString = useI18n()
  const interval = useGetTotalIntervalBlocks()
  const estimatedEndBlock = round.startBlock + interval

  return (
    <Card>
      <CardHeader
        status="canceled"
        icon={<BlockIcon mr="4px" width="21px" />}
        title={TranslateString(999, 'Canceled')}
        epoch={round.epoch}
        blockNumber={estimatedEndBlock}
      />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundResultBox>
          <Flex flexDirection="column" alignItems="center">
            <Text bold color="textDisabled">
              {TranslateString(999, 'Round Canceled')}
            </Text>
            <Link href="https://pancakeswap.finance" external>
              <InfoIcon color="primary" mr="4px" /> {TranslateString(999, 'Learn More')}
            </Link>
          </Flex>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default CanceledRoundCard
