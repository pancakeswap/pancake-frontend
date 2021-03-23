import React from 'react'
import { ArrowBackIcon, ArrowForwardIcon, Card, IconButton } from '@pancakeswap-libs/uikit'
import styled from 'styled-components'
import BunnyCards from '../icons/BunnyCards'
import useSwiper from '../hooks/useSwiper'

const StyledPrevNextNav = styled(Card)`
  align-items: center;
  display: none;
  justify-content: space-between;
  overflow: initial;
  position: relative;
  width: 128px;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

const Icon = styled.div`
  cursor: pointer;
  left: 50%;
  margin-left: -32px;
  position: absolute;
`

const PrevNextNav = () => {
  const { swiper } = useSwiper()

  const handlePrevSlide = () => {
    swiper.slidePrev()
  }

  const handleNextSlide = () => {
    swiper.slideNext()
  }

  const handleSlideToLive = () => {
    return 1
  }

  return (
    <StyledPrevNextNav>
      <IconButton variant="text" scale="sm" onClick={handlePrevSlide}>
        <ArrowBackIcon color="primary" width="24px" />
      </IconButton>
      <Icon onClick={handleSlideToLive}>
        <BunnyCards />
      </Icon>
      <IconButton variant="text" scale="sm" onClick={handleNextSlide}>
        <ArrowForwardIcon color="primary" width="24px" />
      </IconButton>
    </StyledPrevNextNav>
  )
}

export default PrevNextNav
