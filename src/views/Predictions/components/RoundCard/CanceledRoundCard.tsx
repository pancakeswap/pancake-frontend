import React from 'react'
import { CardBody, Text, Flex, BlockIcon, LinkExternal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NodeRound, BetPosition } from 'state/types'
import { useGetTotalIntervalBlocks } from 'state/predictions/hooks'
import ReclaimPositionButton from '../ReclaimPositionButton'
import useIsRefundable from '../../hooks/useIsRefundable'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'

interface CanceledRoundCardProps {
  round: NodeRound
}

const CanceledRoundCard: React.FC<CanceledRoundCardProps> = ({ round }) => {
  const { t } = useTranslation()
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
        title={t('Canceled')}
        epoch={round.epoch}
        blockNumber={estimatedEndBlock}
      />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundResultBox>
          <Flex flexDirection="column" alignItems="center">
            <Text bold color={isRefundable ? 'text' : 'textDisabled'}>
              {t('Round Canceled')}
            </Text>
            {isRefundable && <ReclaimPositionButton epoch={epoch} onSuccess={handleSuccess} width="100%" my="8px" />}
            <LinkExternal href="https://docs.pancakeswap.finance/products/prediction" external>
              {t('Learn More')}
            </LinkExternal>
          </Flex>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default CanceledRoundCard
