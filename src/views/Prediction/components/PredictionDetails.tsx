import React, { useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Text, Flex, Button } from '@pancakeswap-libs/uikit'
import { DIRECTION } from '../types'

const BoldText = styled(Text).attrs({ as: 'span', color: 'card', bold: true })`
  line-height: 100%;
`
const DetailCard = styled.div<{ bg: string }>`
  border-radius: 8px;
  padding: 0 2px 2px 2px;
  background-color: ${({ theme, bg = 'success' }) => theme.colors[bg]};
`
const ComingDetailCard = styled(Flex).attrs({ flexDirection: 'column', alignItems: 'center' })`
  border-radius: 8px;
  padding: 16px;
  border: 2px solid ${(props) => props.theme.colors.input};
  background-color: ${(props) => props.theme.colors.card};
`
const DetailBody = styled.div`
  padding: 8px 16px;
  border-radius: 0 0 8px 8px;
  background-color: ${(props) => props.theme.colors.card};
`
const Line = styled(Flex).attrs({ justifyContent: 'space-between' })`
  font-size: 12px;
  color: ${(props) => props.theme.colors.textSubtle};
  .price {
    color: ${(props) => props.theme.colors.text};
  }
`
const OpButton = styled(Button).attrs({ size: 'sm' })`
  width: 100%;
  color: ${(props) => props.theme.colors.card};
`

type PredictionDetailsProps = {
  lockPrice: string
  endPrice: string
  totalAmount: string
}
type ComingPredictionDetailsProps = {
  userAmount: string,
  onBid: () => void
}

export const PredictionDetails: React.FC<PredictionDetailsProps> = ({ lockPrice, endPrice, totalAmount }) => {
  const diff = useMemo(() => new BigNumber(endPrice).minus(lockPrice).abs().toFixed(4), [endPrice, lockPrice])
  const up = +endPrice - +lockPrice > 0

  return (
    <DetailCard bg={up ? 'success' : 'failure'}>
      <Flex py="2" px="3" justifyContent="space-between">
        <BoldText>{up ? 'PUMP' : 'DUMP'}</BoldText>
        <BoldText bold={false}>+${diff}</BoldText>
      </Flex>
      <DetailBody>
        <Line>
          Locked price: <span className="price">${lockPrice}</span>
        </Line>
        <Line>
          Last price: <span className="price">${endPrice}</span>
        </Line>
        <Line>
          Pool: <span className="price">{totalAmount} BNB</span>
        </Line>
      </DetailBody>
    </DetailCard>
  )
}

export const ComingPredictionDetails: React.FC<ComingPredictionDetailsProps> = ({ userAmount, onBid }) => (
  <ComingDetailCard>
    {+userAmount > 0 ? (
      <OpButton variant="success" my='10px' onClick={onBid}>
        Adjust Position
      </OpButton>
    ) : (
      <>
        <OpButton variant="success" onClick={onBid}>
          Enter PUMP
        </OpButton>
        <OpButton mt="2" variant="danger" onClick={onBid}>
          Enter DUMP
        </OpButton>
      </>
    )}
  </ComingDetailCard>
)

export default { }