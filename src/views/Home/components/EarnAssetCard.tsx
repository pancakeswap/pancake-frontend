import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import { poolsConfig } from 'sushi/lib/constants'

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(#53dee9, #7645d9);
  margin-left: auto;
  margin-right: auto;
  max-width: 344px;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const Label = styled(Heading)`
  color: ${({ theme }) => theme.colors.display};
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  color: white;
  font-size: 35px;
`
const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  color: #1fc7d4, 100%;
`

const EarnAssetCard = () => {
  const check = poolsConfig.slice(3, 7)

  const result = check.map((token) => `${token.tokenName}, `)

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <Label mb={0}>Earn</Label>
        <CardMidContent mb={0}>{result}</CardMidContent>
        <Label>in Pools</Label>
        <NavLink exact activeClassName="active" to="/syrup">
          <Row>
            <ArrowForwardIcon />
          </Row>
        </NavLink>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default EarnAssetCard
