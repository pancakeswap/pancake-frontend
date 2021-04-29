import React from 'react'
import { CardBody, Text, Flex, BlockIcon, LinkExternal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Round, BetPosition } from 'state/types'
import { useGetTotalIntervalBlocks } from 'state/hooks'
import ReclaimPositionButton from '../ReclaimPositionButton'
import useIsRefundable from '../../hooks/useIsRefundable'
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
  const { isRefundable, setIsRefundable } = useIsRefundable(round.epoch)
  const { epoch, startBlock } = round
  const estimatedEndBlock = startBlock + interval

  const handleSuccess = async () => {
    setIsRefundable(false)
  }

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
            <Text bold color={isRefundable ? 'text' : 'textDisabled'}>
              {TranslateString(999, 'Round Canceled')}
            </Text>
            {isRefundable && <ReclaimPositionButton epoch={epoch} onSuccess={handleSuccess} width="100%" my="8px" />}
            <LinkExternal href="https://docs.pancakeswap.finance/products/prediction" external>
              {TranslateString(999, 'Learn More')}
            </LinkExternal>
          </Flex>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default CanceledRoundCard
