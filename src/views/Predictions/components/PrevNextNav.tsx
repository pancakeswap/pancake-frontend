import React from 'react'
import { ArrowBackIcon, ArrowForwardIcon, Card, IconButton } from '@pancakeswap-libs/uikit'
import SwiperCore from 'swiper'
import styled from 'styled-components'
import BunnyCards from '../icons/BunnyCards'

interface PrevNextNavProps {
  swiperInstance: SwiperCore
  onSlideToLive: () => void
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

const PrevNextNav: React.FC<PrevNextNavProps> = ({ swiperInstance, onSlideToLive }) => {
  const handlePrevSlide = () => {
    swiperInstance.slidePrev()
  }

  const handleNextSlide = () => {
    swiperInstance.slideNext()
  }

  return (
    <StyledPrevNextNav>
      <IconButton variant="text" scale="sm" onClick={handlePrevSlide}>
        <ArrowBackIcon color="primary" width="24px" />
      </IconButton>
      <Icon onClick={onSlideToLive}>
        <BunnyCards />
      </Icon>
      <IconButton variant="text" scale="sm" onClick={handleNextSlide}>
        <ArrowForwardIcon color="primary" width="24px" />
      </IconButton>
    </StyledPrevNextNav>
  )
}

export default PrevNextNav
