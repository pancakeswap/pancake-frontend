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

const CardTitle = styled(Heading)`
  display: flex;
  margin-bottom: 0px;
  color: #191326;
`

const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  display: flex;
  margin-bottom: 0px;
  color: white;
  font-size: 35px;
`
const CardFooter = styled(Heading)`
  display: flex;
  color: #191326;
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
        <CardTitle>Earn</CardTitle>
        <CardMidContent>{result}</CardMidContent>
        <CardFooter>in Pools</CardFooter>
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
