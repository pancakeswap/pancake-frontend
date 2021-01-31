import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Card, BlockIcon, RemoveIcon, InfoIcon, Flex, ArrowDownIcon } from '@pancakeswap-libs/uikit'
import CountDown from './CountDown'
import { PredictionDetails } from './PredictionDetails'

export enum STATUS {
  'EXPIRED' = 'EXPIRED',
  'LIVE' = 'LIVE',
  'COMING' = 'COMING',
}
export enum DIRECTION {
  'UP' = 'UP',
  'DOWN' = 'DOWN',
}
const ConfigMap = {
  [STATUS.EXPIRED]: {
    bg: 'backgroundDisabled',
    icon: BlockIcon,
  },
  [STATUS.LIVE]: {
    bg: 'primary',
    icon: InfoIcon,
  },
  [STATUS.COMING]: {
    bg: 'textSubtle',
    icon: RemoveIcon,
  },
}

type PredictionItemPorps = {
  status: STATUS
}

const StyledCard = styled(Card)`
  border-radius: 16px;
  width: 256px;
  margin-left: 16px;
  flex-shrink: 0;
`
const CardHeader = styled.div<{ status: STATUS }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  padding: 0 16px;
  background-color: ${({ theme, status }) => theme.colors[ConfigMap[status].bg]};
`
const CardBody = styled.div`
  padding: 8px 8px 16px;
`
const SmallText = styled(Text).attrs({ as: 'span', fontSize: '12px' })`
  line-height: 100%;
`
const SubtleText = styled(Text).attrs({ as: 'span', color: 'textSubtle', fontSize: '12px' })`
  line-height: 100%;
`
const DirectionContainer = styled.div<{ direction: DIRECTION }>`
  display: flex;
  align-items: center;
  margin: 0 8px;
  border-radius: ${({ direction }) => (direction === DIRECTION.UP ? '8px 8px 0 0' : '0 0 8px 8px')};
  background-color: ${(props) => props.theme.colors.backgroundDisabled};
`
const IconBox = styled.i<{ direction: DIRECTION }>`
  display: inline-block;
  width: 24px;
  height: 28px;
  padding: 2px 0;
  text-align: center;
  border-radius: ${({ direction }) => (direction === DIRECTION.UP ? '8px 0 0 0' : '0 0 0 8px')};
  background-color: ${({ direction, theme }) =>
    direction === DIRECTION.UP ? theme.colors.success : theme.colors.textDisabled};
`

const Direction = ({ direction }) => {
  const rotateDge = useMemo(() => (direction === DIRECTION.UP ? 180 : 0), [direction])

  return (
    <DirectionContainer direction={direction}>
      <IconBox direction={direction}>
        <ArrowDownIcon width="24px" color="card" style={{ transform: `rotate(${rotateDge}deg)` }} />
      </IconBox>
      <Flex px="2" flex="1" justifyContent="space-between">
        <SubtleText>
          Pool:&nbsp;<SmallText>123123 BNB</SmallText>
        </SubtleText>
        <SubtleText>
          Payout:&nbsp;<SmallText>1.90x</SmallText>
        </SubtleText>
      </Flex>
    </DirectionContainer>
  )
}

const PredictionItem: React.FC<PredictionItemPorps> = ({ status = STATUS.COMING }) => {
  const { icon: IconComp } = ConfigMap[status]
  const isActive = status === STATUS.LIVE

  return (
    <StyledCard isActive={isActive}>
      <CardHeader status={status}>
        <Text as="span" bold color="card">
          <IconComp mr="4px" width="16px" />
          Expired
        </Text>
        {status !== STATUS.EXPIRED ? (
          <CountDown seconds={6000} bold={false} color="card" style={{ width: '68px' }} />
        ) : (
          <Text color="success">You Won!</Text>
        )}
      </CardHeader>
      <CardBody>
        <Flex px="3" pb="2" style={{ fontSize: '12px' }} justifyContent="space-between">
          <SubtleText>Your Position:</SubtleText>
          <SmallText color="success">123123 BNB | PUMP</SmallText>
        </Flex>
        <Direction direction={DIRECTION.UP} />
        <PredictionDetails />
        <Direction direction={DIRECTION.DOWN} />
      </CardBody>
    </StyledCard>
  )
}

export default PredictionItem
