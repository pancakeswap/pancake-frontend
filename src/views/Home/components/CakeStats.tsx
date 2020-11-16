import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import useSushi from 'hooks/useSushi'
import { getSushiAddress } from 'sushi/utils'
import CardValue from 'components/Card/CardValue'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 435px;
  }
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const Title = styled(Heading).attrs({ size: 'lg' })`
  margin-bottom: 24px;
`

const CakeStats = () => {
  const TranslateString = useI18n()
  const sushi = useSushi()
  const totalSupply = useTotalSupply()
  const burnedBalance = useBurnedBalance(getSushiAddress(sushi))
  const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - getBalanceNumber(burnedBalance) : 0

  return (
    <StyledCakeStats>
      <CardBody>
        <Title>{TranslateString(999, 'Cake Stats')}</Title>
        <Row>
          <Text fontSize="14px">{TranslateString(999, 'Total CAKE Supply')}</Text>
          {cakeSupply && <CardValue fontSize="14px" value={cakeSupply} />}
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(999, 'Total CAKE Burned')}</Text>
          <CardValue fontSize="14px" value={getBalanceNumber(burnedBalance)} />
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(999, 'New CAKE/block')}</Text>
          <CardValue fontSize="14px" decimals={0} value={25} />
        </Row>
      </CardBody>
    </StyledCakeStats>
  )
}

export default CakeStats
