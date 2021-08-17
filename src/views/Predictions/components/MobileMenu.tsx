import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import {
  ArrowBackIcon,
  ArrowForwardIcon, Button,
  ButtonMenu,
  ButtonMenuItem,
  Cards,
  ChartIcon, Flex,
  HistoryIcon,
  IconButton, LinkExternal,
} from '@rug-zombie-libs/uikit'
import { useAppDispatch } from 'state'
import { PredictionStatus } from 'state/types'
import { useGetPredictionsStatus, useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/hooks'
import { setChartPaneState, setHistoryPaneState } from 'state/predictions'
import useSwiper from '../hooks/useSwiper'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { APESWAP_ADD_LIQUIDITY_URL, BASE_EXCHANGE_URL } from '../../../config'
import auctions from '../../../redux/auctions'
import { auctionById } from '../../../redux/get'

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
  justify-content: center;
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

interface MobileMenuProps {
  id: number;
  refreshMobile: any;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ id, refreshMobile }) => {
  const isHistoryOpen = useIsHistoryPaneOpen()
  const isChartOpen = useIsChartPaneOpen()
  const activeIndex = getActiveIndex(isHistoryOpen, isChartOpen)
  const {token0, token1, userInfo: { bid }} = auctionById(id)

  const handleItemClick = () => {

    refreshMobile()
  }


  return (
    <StyledMobileMenu>
      <ButtonNav style={{marginLeft: "20px"}}>
        <Button>
          Your Bid: {getFullDisplayBalance(bid)}
        </Button>
      </ButtonNav>
      <TabNav style={{marginLeft: "40px"}}>
        <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle" onItemClick={handleItemClick}>
          <ButtonMenuItem>
            <Cards color="primary" />
          </ButtonMenuItem>
          <div/>
        </ButtonMenu>
      </TabNav>
      <ButtonNav>
        <a href={`${APESWAP_ADD_LIQUIDITY_URL}//${token0}/${token1}`} target="_blank" rel="noreferrer">

        <Button variant="text">
          Get BT (Bid Tokens):
        </Button>
        </a>
      </ButtonNav>
    </StyledMobileMenu>
  )
}

export default MobileMenu
