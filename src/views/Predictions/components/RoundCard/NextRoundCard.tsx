import React, { useState } from 'react'
import SwiperCore from 'swiper'
import {
  CardBody,
  CardHeader,
  Flex,
  Text,
  PlayCircleOutlineIcon,
  Button,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Position, Round } from 'state/types'
import CardFlip from '../CardFlip'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import RoundInfoBox from './RoundInfoBox'
import SetPositionCard from './SetPositionCard'

interface NextRoundCardProps {
  round: Round
  swiperInstance: SwiperCore
}

const NextRoundCard: React.FC<NextRoundCardProps> = ({ round, swiperInstance }) => {
  const [state, setState] = useState({
    isSettingPosition: false,
    defaultPosition: Position.UP,
  })
  const TranslateString = useI18n()

  const handleBack = () =>
    setState((prevState) => ({
      ...prevState,
      isSettingPosition: false,
    }))

  const handleSetPosition = (defaultPosition) => {
    setState({
      isSettingPosition: true,
      defaultPosition,
    })
  }

  return (
    <CardFlip isFlipped={state.isSettingPosition} height="425px">
      <Card>
        <CardHeader p="8px">
          <Flex alignItems="center" justifyContent="space-between">
            <Flex alignItems="center">
              <PlayCircleOutlineIcon mr="4px" width="14px" />
              <Text fontSize="14px">{TranslateString(999, 'Next')}</Text>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody p="16px">
          <MultiplierArrow />
          <RoundInfoBox>
            <Button
              variant="success"
              startIcon={<ArrowUpIcon color="white" width="24px" />}
              width="100%"
              onClick={() => handleSetPosition(Position.UP)}
              mb="4px"
            >
              {TranslateString(999, 'Up')}
            </Button>
            <Button
              variant="danger"
              startIcon={<ArrowDownIcon color="white" width="24px" />}
              width="100%"
              onClick={() => handleSetPosition(Position.DOWN)}
            >
              {TranslateString(999, 'Down')}
            </Button>
          </RoundInfoBox>
          <MultiplierArrow roundPosition={Position.DOWN} />
        </CardBody>
      </Card>
      <SetPositionCard onBack={handleBack} defaultPosition={state.defaultPosition} swiperInstance={swiperInstance} />
    </CardFlip>
  )
}

export default NextRoundCard
