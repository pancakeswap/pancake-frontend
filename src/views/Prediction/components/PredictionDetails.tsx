import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex } from '@pancakeswap-libs/uikit'

const BoldText = styled(Text).attrs({ as: 'span', color: 'card', bold: true })`
  line-height: 100%;
`
const DetailCard = styled.div`
  border-radius: 8px;
  padding: 0 2px 2px 2px;
  background-color: ${(props) => props.theme.colors.success};
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

export const PredictionDetails: React.FC = () => {
  return (
    <DetailCard>
      <Flex py="2" px="3" justifyContent="space-between">
        <BoldText>PUMP</BoldText>
        <BoldText bold={false}>+$1.00</BoldText>
      </Flex>
      <DetailBody>
        <Line>
          Locked price: <span className="price">$32.38</span>
        </Line>
        <Line>
          Last price: <span className="price">$32.38</span>
        </Line>
        <Line>
          Pool: <span className="price">1234.8 BNB</span>
        </Line>
      </DetailBody>
    </DetailCard>
  )
}

export default {}
