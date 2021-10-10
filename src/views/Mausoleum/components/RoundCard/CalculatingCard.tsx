import React from 'react'
import { CardBody, Flex, Spinner, WaitIcon } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Round, BetPosition } from 'state/types'
import { useGetTotalIntervalBlocks } from 'state/hooks'
import { RoundResultBox } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'

interface CalculatingCardProps {
  bid: any,
  id: number
}

const CalculatingCard: React.FC<CalculatingCardProps> = ({ bid, id }) => {
  const { t } = useTranslation()
  const interval = useGetTotalIntervalBlocks()

  return (
    <Card>
      <CardHeader
        status="calculating"
        icon={<WaitIcon mr="4px" width="21px" />}
        title={t('Calculating')}
        bid={bid}
        id={id}
      />
      <CardBody p="16px">
        <MultiplierArrow isDisabled />
        <RoundResultBox>
          <Flex alignItems="center" justifyContent="center">
            <Spinner size={96} />
          </Flex>
        </RoundResultBox>
        <MultiplierArrow betPosition={BetPosition.BEAR} isDisabled />
      </CardBody>
    </Card>
  )
}

export default CalculatingCard
