import React from 'react'
import { ArrowBackIcon, ArrowForwardIcon, Card, IconButton } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import BunnyCards from '../icons/BunnyCards'

const StyledCardNav = styled(Card)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  overflow: initial;
  position: relative;
  width: 128px;
`

const Icon = styled.div`
  position: absolute;
  left: 50%;
  margin-left: -32px;
`

const CardNav = () => {
  return (
    <StyledCardNav>
      <IconButton variant="text" scale="sm">
        <ArrowBackIcon color="primary" width="24px" />
      </IconButton>
      <Icon>
        <BunnyCards />
      </Icon>
      <IconButton variant="text" scale="sm">
        <ArrowForwardIcon color="primary" width="24px" />
      </IconButton>{' '}
    </StyledCardNav>
  )
}

export default CardNav
