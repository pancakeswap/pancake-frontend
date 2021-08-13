import React from 'react'
import auctions from 'redux/auctions'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { routes } from 'routes'
import Container from './Container'

const Row = styled.div`
    display: flex;
`
const StyledCard = styled.div`
    margin: 10px;
    box-shadow: rgb(204 246 108) 0px 0px 20px;
`
const StyledImage = styled.img`
    height: 300px;
    width: 300px;
`

const Auctions = (props) => {
  const {auction} = props
  const history = useHistory()
  return (
    <StyledCard>
      <StyledImage src="/images/rugZombie/Patient Zero.jpg" alt="AUCTION" onClick={() => history.push(`${routes.MAUSOLEUM  }${  auction.aid}`)}/>
    </StyledCard>
  )
}
const PredictionsHome = () => {
  return(
    <Container>
      <Row>
        {auctions.map((value,index) => <Auctions key={value.aid} auction={value}/>)
        }
      </Row>
    </Container>
  )
}

export default PredictionsHome
