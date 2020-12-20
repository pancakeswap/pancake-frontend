import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, ArrowForwardIcon } from '@pancakeswap-libs/uikit'
import { NavLink } from 'react-router-dom'
import useI18n from 'hooks/useI18n'

const StyledFarmStakingCard = styled(Card)`
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
  margin-bottom: 0px;
`
const Row = styled.div`
  display: flex;
  justify-content: flex-end;
`

const FarmedStakingCard = () => {
    const TranslateString = useI18n() 
   

  return (
    <StyledFarmStakingCard>
      <CardBody>
        <div>Win up to</div>
        <CardMidContent>{TranslateString(999, '293% APY')}</CardMidContent>
        <div>in Lottery</div>
        <NavLink exact activeClassName="active" to="/lottery">
          <Row> 
            <ArrowForwardIcon />
          </Row>
        </NavLink>
      </CardBody>
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
