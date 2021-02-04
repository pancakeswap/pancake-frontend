import React, { useMemo } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, Card, BlockIcon, RemoveIcon, InfoIcon, Flex, ArrowDownIcon } from '@pancakeswap-libs/uikit'
import { useMarketPrice } from 'hooks/useMarketPrice'
import CountDown from './CountDown'
import { PredictionDetails, ComingPredictionDetails } from './PredictionDetails'
import { STATUS, DIRECTION, IRound } from '../types'

const ConfigMap = {
  [STATUS.EXPIRED]: {
    bg: 'backgroundDisabled',
    icon: BlockIcon,
    label: 'Expired',
  },
  [STATUS.LIVE]: {
    bg: 'primary',
    icon: BlockIcon,
    label: 'Live',
  },
  [STATUS.COMING]: {
    bg: 'textSubtle',
    icon: BlockIcon,
    label: 'Soon',
  },
}

const StyledCard = styled(Card)`
  flex-shrink: 0;
  align-self: start;
  border-radius: 16px;
  width: 256px;
  margin-left: 16px;
  display: inline-block;
  vertical-align: top;
  &:last-child {
    margin-right: 16px;
  }
`
const CardHeader = styled(Flex)<{ status: STATUS }>`
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
  border-radius: ${({ direction }) => (direction === DIRECTION.BULL ? '8px 8px 0 0' : '0 0 8px 8px')};
  background-color: ${(props) => props.theme.colors.backgroundDisabled};
`
const IconBox = styled.i<{ direction: DIRECTION }>`
  display: inline-block;
  width: 24px;
  height: 28px;
  padding: 2px 0;
  text-align: center;
  border-radius: ${({ direction }) => (direction === DIRECTION.BULL ? '8px 0 0 0' : '0 0 0 8px')};
  background-color: ${({ direction, theme }) =>
    direction === DIRECTION.BULL ? theme.colors.success : theme.colors.textDisabled};
`
const ClaimButton = styled.span`
  font-size: 12px;
  border-radius: 4px;
  padding: 0 2px;
  cursor: pointer;
  margin-right: 4px;
  color: ${(props) => props.theme.colors.card};
  background-color: ${(props) => props.theme.colors.primary};
`

const Direction = ({ amount, payout, direction }) => {
  const rotateDge = useMemo(() => (direction === DIRECTION.BULL ? 180 : 0), [direction])

  return (
    <DirectionContainer direction={direction}>
      <IconBox direction={direction}>
        <ArrowDownIcon width="24px" color="card" style={{ transform: `rotate(${rotateDge}deg)` }} />
      </IconBox>
      <Flex px="2" flex="1" justifyContent="space-between">
        <SubtleText>
          Pool:&nbsp;<SmallText>{amount} BNB</SmallText>
        </SubtleText>
        <SubtleText>
          Payout:&nbsp;<SmallText>{+payout === 0 ? '-' : `${payout}x`}</SmallText>
        </SubtleText>
      </Flex>
    </DirectionContainer>
  )
}

type IPredictionItem = IRound & {
  remainSecond?: number
  currentEpoch?: number
  onBid?: () => void
  handleClaim?: (epoch: number) => void
}

export const PredictionItem: React.FC<IPredictionItem> = (props) => {
  const {
    epoch,
    status = STATUS.COMING,
    userAmount,
    userDirection,
    bullAmount,
    bearAmount,
    totalAmount,
    lockPrice,
    endPrice,
    onBid,
    claimed,
    claimable,
    remainSecond,
    handleClaim,
    currentEpoch,
  } = props
  const { icon: IconComp, label } = ConfigMap[status]
  const isActive = status === STATUS.LIVE
  const hasStaked = +userAmount > 0
  const bullPayout = useMemo(
    () => (+bullAmount === 0 ? '0' : new BigNumber(totalAmount).times(0.9).dividedBy(bullAmount).toFixed(2)),
    [totalAmount, bullAmount],
  )
  const bearPayout = useMemo(
    () => (+bearAmount === 0 ? '0' : new BigNumber(totalAmount).times(0.9).dividedBy(bearAmount).toFixed(2)),
    [totalAmount, bearAmount],
  )

  const renderAddon = () => {
    if (status !== STATUS.EXPIRED) {
      return (
        <CountDown
          key={`${currentEpoch}-${remainSecond}`}
          seconds={remainSecond}
          bold={false}
          color="card"
          style={{ width: '68px' }}
        />
      )
    }
    if (hasStaked) {
      if (claimed || claimable) {
        <Text color="success">
          <ClaimButton onClick={() => handleClaim(epoch)}>Claim</ClaimButton>You Won!
        </Text>
      }
      return <Text color="failure">You Lost...</Text>
    }
    return null
  }

  return (
    <StyledCard isActive={isActive}>
      <CardHeader status={status}>
        <Text as="span" bold color="card">
          <Flex>
            <Text fontSize="10px" mr="2px" style={{ lineHeight: '24px' }}>
              R{epoch}
            </Text>
            <IconComp mr="4px" color="card" width="16px" />
            {label}
          </Flex>
        </Text>
        {renderAddon()}
      </CardHeader>
      <CardBody>
        <Flex px="3" pb="2" style={{ fontSize: '12px' }} justifyContent="space-between">
          <SubtleText>Your Position:</SubtleText>
          {!hasStaked ? (
            '-'
          ) : (
            <SmallText color="success">
              {userAmount} BNB | {userDirection === DIRECTION.BULL ? 'PUMP' : 'BUMP'}
            </SmallText>
          )}
        </Flex>
        <Direction amount={bullAmount} direction={DIRECTION.BULL} payout={bullPayout} />
        {status === STATUS.COMING ? (
          <ComingPredictionDetails onBid={onBid} userAmount={userAmount} />
        ) : (
          <PredictionDetails lockPrice={lockPrice} endPrice={endPrice} totalAmount={totalAmount} />
        )}
        <Direction amount={bearAmount} direction={DIRECTION.BEAR} payout={bearPayout} />
      </CardBody>
    </StyledCard>
  )
}

export const ActivePredictionItem: React.FC<IPredictionItem> = React.memo((props) => {
  const marketPrice = useMarketPrice()

  return <PredictionItem {...props} endPrice={marketPrice} />
})

export default {}
