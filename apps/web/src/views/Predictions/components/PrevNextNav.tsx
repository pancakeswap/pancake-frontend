import { ArrowBackIcon, ArrowForwardIcon, BunnyCardsIcon, Flex, IconButton } from '@pancakeswap/uikit'
import { useGetSortedRoundsCurrentEpoch } from 'state/predictions/hooks'
import { styled } from 'styled-components'
import useSwiper from '../hooks/useSwiper'

const StyledPrevNextNav = styled(Flex)`
  align-items: center;
  display: none;
  justify-content: space-between;
  overflow: initial;
  position: relative;
  width: 128px;
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
  left: 50%;
  margin-left: -32px;
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
      const currentEpochIndex = rounds?.findIndex((round) => round.epoch === currentEpoch)
      if (currentEpochIndex !== undefined && currentEpochIndex !== null) {
        swiper.slideTo(currentEpochIndex - 1)
      }
    }
  }

  return (
    <StyledPrevNextNav>
      <IconButton variant="text" scale="sm" onClick={handlePrevSlide}>
        <ArrowBackIcon color="primary" width="24px" />
      </IconButton>
      <Icon onClick={handleSlideToLive}>
        <BunnyCardsIcon width="64px" />
      </Icon>
      <IconButton variant="text" scale="sm" onClick={handleNextSlide}>
        <ArrowForwardIcon color="primary" width="24px" />
      </IconButton>
    </StyledPrevNextNav>
  )
}

export default PrevNextNav
