import styled from 'styled-components'
import { useWeb3React } from '@pancakeswap/wagmi'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  ButtonMenu,
  ButtonMenuItem,
  Cards,
  ChartIcon,
  HistoryIcon,
  IconButton,
} from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { PredictionStatus } from 'state/types'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/predictions/hooks'
import { setChartPaneState, setHistoryPaneState } from 'state/predictions'
import useSwiper from '../hooks/useSwiper'

const ButtonNav = styled.div`
  flex: none;
`

const TabNav = styled.div`
  flex: 1;
  text-align: center;
`

const StyledMobileMenu = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.card.background};
  display: flex;
  flex: none;
  height: 64px;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`

const getActiveIndex = (isHistoryOpen: boolean, isChartOpen: boolean) => {
  if (isHistoryOpen) {
    return 2
  }

  if (isChartOpen) {
    return 1
  }

  return 0
}

const MobileMenu = () => {
  const { swiper } = useSwiper()
  const isHistoryOpen = useIsHistoryPaneOpen()
  const isChartOpen = useIsChartPaneOpen()
  const status = useGetPredictionsStatus()
  const activeIndex = getActiveIndex(isHistoryOpen, isChartOpen)
  const dispatch = useLocalDispatch()
  const { account } = useWeb3React()

  const handleItemClick = (index: number) => {
    switch (index) {
      case 2:
        dispatch(setHistoryPaneState(true))
        break
      case 1:
        dispatch(setChartPaneState(true))
        dispatch(setHistoryPaneState(false))
        break
      case 0:
      default:
        dispatch(setHistoryPaneState(false))
        dispatch(setChartPaneState(false))
    }
  }

  return (
    <StyledMobileMenu>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slidePrev()} disabled={status !== PredictionStatus.LIVE}>
          <ArrowBackIcon width="24px" color="primary" />
        </IconButton>
      </ButtonNav>
      <TabNav>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle" onItemClick={handleItemClick}>
          <ButtonMenuItem>
            <Cards color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem>
            <ChartIcon color="currentColor" />
          </ButtonMenuItem>
          <ButtonMenuItem disabled={!account}>
            <HistoryIcon color="currentColor" />
          </ButtonMenuItem>
        </ButtonMenu>
      </TabNav>
      <ButtonNav>
        <IconButton variant="text" onClick={() => swiper.slideNext()} disabled={status !== PredictionStatus.LIVE}>
          <ArrowForwardIcon width="24px" color="primary" />
        </IconButton>
      </ButtonNav>
    </StyledMobileMenu>
  )
}

export default MobileMenu
