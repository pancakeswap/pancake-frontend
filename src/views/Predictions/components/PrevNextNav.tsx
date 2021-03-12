import React from 'react'
import { ArrowBackIcon, ArrowForwardIcon, Card, IconButton } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import BunnyCards from '../icons/BunnyCards'

interface PrevNextNavProps {
  onSlideToLive: () => void
  onNext: () => void
  onPrev: () => void
}

const StyledPrevNextNav = styled(Card)`
  align-items: center;
  display: none;
  justify-content: space-between;
  overflow: initial;
  position: relative;
  width: 128px;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`

const Icon = styled.div`
  cursor: pointer;
  left: 50%;
  margin-left: -32px;
  position: absolute;
`

const PrevNextNav: React.FC<PrevNextNavProps> = ({ onSlideToLive, onNext, onPrev }) => {
  return (
    <StyledPrevNextNav>
      <IconButton variant="text" scale="sm" onClick={onPrev}>
        <ArrowBackIcon color="primary" width="24px" />
      </IconButton>
      <Icon onClick={onSlideToLive}>
        <BunnyCards />
      </Icon>
      <IconButton variant="text" scale="sm" onClick={onNext}>
        <ArrowForwardIcon color="primary" width="24px" />
      </IconButton>{' '}
    </StyledPrevNextNav>
  )
}

export default PrevNextNav
