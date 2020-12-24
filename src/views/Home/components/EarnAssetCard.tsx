import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import useI18n from 'hooks/useI18n'
import { poolsConfig } from 'sushi/lib/constants'

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(#53DEE9, #7645D9);
  margin-left: auto;
  margin-right: auto;
  max-width: 344px;
  width: 100%;
  

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`
const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  display: flex;
  margin-bottom: 0px;
  color: white;
  font-size: 35px
`
const Row = styled.div`
  display: flex;
  justify-content: flex-end;
  color: #1FC7D4, 100%
`
const CardAsset = styled.div`
  display: flex;
`

const FarmedStakingCard = () => {
    const TranslateString = useI18n() 
const check = poolsConfig.slice(0, 4)
console.log(`here: ${check.slice(0, 4).map(token => token.tokenName)}`)

const seee = check.map(token => token.tokenName)

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <div>Earn</div>
        <CardMidContent>{
          check.map(token => 
            `${token.tokenName}, `
          ) 
        }</CardMidContent>
        <div>in Pools</div>
        <NavLink exact activeClassName="active" to="/syrup">
          <Row> 
            <ArrowForwardIcon />
          </Row>
        </NavLink>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
