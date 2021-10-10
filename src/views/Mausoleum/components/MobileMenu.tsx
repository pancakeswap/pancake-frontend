import React from 'react'
import styled from 'styled-components'
import {
  Text, Button,
  ButtonMenu,
  Cards, Flex,
} from '@rug-zombie-libs/uikit'
import {  useIsChartPaneOpen, useIsHistoryPaneOpen } from 'state/hooks'
import { getFullDisplayBalance } from '../../../utils/formatBalance'
import { APESWAP_ADD_LIQUIDITY_URL } from '../../../config'
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
  const {token0, token1, version, userInfo: { bid }} = auctionById(id)
  const v3 = version === 'v3'
  const handleItemClick = () => {

    refreshMobile()
  }


  return (
    <StyledMobileMenu>
      <Flex justifyContent="space-between" pl="10px" pr="10px" alignItems="center" height="100%" width="100%">
        <Button scale="sm">
          Your Bid: {getFullDisplayBalance(bid)}
        </Button>
          <Button scale="sm" onClick={handleItemClick}>
            <Cards color="tertiary" />
            <Text color="tertiary" bold>
              &nbsp;Auction Info
            </Text>

          </Button>
      {!v3 ? <ButtonNav>
        <a href={`${APESWAP_ADD_LIQUIDITY_URL}//${token0}/${token1}`} target='_blank' rel='noreferrer'>
          <Button variant='text'>
            Get BT (Bid Tokens):
          </Button>
        </a>
      </ButtonNav> : null}
      </Flex>
    </StyledMobileMenu>
  )
}

export default MobileMenu
