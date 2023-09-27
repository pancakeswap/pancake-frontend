import { ArrowBackIcon, ArrowForwardIcon, Flex, IconButton } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { useGetSortedRoundsCurrentEpoch } from 'state/predictions/hooks'
import Image from 'next/image'
import useSwiper from '../hooks/useSwiper'

const StyledPrevNextNav = styled(Flex)`
  align-items: center;
  display: none;
  justify-content: space-between;
  overflow: initial;
  position: relative;
  width: 139px;
  z-index: 1;

  box-shadow: ${({ theme }) => theme.shadows.level1};
  border-radius: ${({ theme }) => theme.radii.default};
  background-color: ${({ theme }) => theme.card.background};

  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
  }
`

const Icon = styled.div`
  position: absolute;
  cursor: pointer;
  margin-left: 5px;
  left: 20%;
  transform: translateX(-13px);
`

const PrevNextNav = () => {
  const { swiper } = useSwiper()
  const { currentEpoch, rounds } = useGetSortedRoundsCurrentEpoch()

  const handlePrevSlide = () => {
    swiper?.slidePrev()
  }

  const handleNextSlide = () => {
    swiper?.slideNext()
  }

  const handleSlideToLive = () => {
    if (swiper) {
      const currentEpochIndex = rounds.findIndex((round) => round.epoch === currentEpoch)
      swiper.slideTo(currentEpochIndex - 1)
    }
  }

  return (
    <StyledPrevNextNav>
      <IconButton variant="text" scale="sm" onClick={handlePrevSlide}>
        <ArrowBackIcon color="primary" width="24px" />
      </IconButton>
      <Icon onClick={handleSlideToLive}>
        <Image width={139} height={120} src="/images/predictions/birthday/birthday-icon.png" alt="birthday-icon" />
      </Icon>
      <IconButton variant="text" scale="sm" onClick={handleNextSlide}>
        <ArrowForwardIcon color="primary" width="24px" />
      </IconButton>
    </StyledPrevNextNav>
  )
}

export default PrevNextNav
