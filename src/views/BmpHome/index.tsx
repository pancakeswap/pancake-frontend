import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Flex, Button, Svg, Image, Box, EarnFilledIcon, WalletIcon, SwapFillIcon } from '@pancakeswap/uikit'
import mpService from '@binance/mp-service'
import { useTranslation } from 'contexts/Localization'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
// bmp use full image
import helpImage from '../../../public/images/help-full.png'
import CustomNav from './components/CustomNav'
import Providers from '../../PageProvider.bmp'
import AddLiquidity from '../AddLiquidity/bmp/index'
import Swap from '../Swap/bmp/index'

const BubbleWrapper = styled(Flex)`
  align-items: center;
  bn-view {
    transition: background-color 0.2s, opacity 0.2s;
  }
  &:hover {
    svg {
      opacity: 0.65;
    }
  }
  &:active {
    svg {
      opacity: 0.85;
    }
  }
`

const Footer = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Flex
      flexGrow={1}
      alignItems="center"
      width={['100%', '100%', '100%', 'auto']}
      justifyContent={['center', 'center', 'center', 'flex-end']}
      paddingTop="14px"
    >
      <BubbleWrapper>
        <Button
          id="clickExchangeHelp"
          as="a"
          external
          href="https://docs.pancakeswap.finance/products/pancakeswap-exchange"
          variant="subtle"
        >
          {t('Need help ?')}
        </Button>
        <Svg color={theme.colors.textSubtle} viewBox="0 0 16 16">
          <path d="M0 16V0C0 0 3 1 6 1C9 1 16 -2 16 3.5C16 10.5 7.5 16 0 16Z" />
        </Svg>
      </BubbleWrapper>
      <Image src={helpImage} alt="Get some help" width={160} height={128} />
    </Flex>
  )
}

const StyledPage = styled.div`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  min-height: calc(100vh - 64px);
  padding: 16px;
  overflow-y: scroll;
  padding-bottom: 64px;
`
const FooterWrap = styled(Flex)`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  padding-bottom: 24px;
  height: var(--mp-tabbar-height);
  z-index: 20;
  justify-content: center;
`
const Item = ({ icon, title, isActive, ...props }) => {
  const theme = useTheme()
  return (
    <Flex flexDirection="column" alignItems="center" width="94px" {...props}>
      <Box mb="5px">
        {React.createElement(icon, {
          color: isActive ? theme.colors.secondary : theme.colors.textSubtle,
        })}
      </Box>
      <Box fontSize="14px" fontWeight={isActive ? '600' : '400'} color={isActive ? 'secondary' : 'textSubtle'}>
        {title}
      </Box>
    </Flex>
  )
}
const FooterMenu = ({ activeId, setActiveId }) => {
  const { t } = useTranslation()
  const list = [
    {
      icon: SwapFillIcon,
      title: t('Exchange'),
      isActive: activeId === 0,
      onClick: () => {
        mpService.navigateTo({ url: 'views/Swap/bmp/index' })
        setActiveId(0)
      },
    },
    {
      icon: EarnFilledIcon,
      title: t('Liquidity'),
      isActive: activeId === 1,
      onClick: () => {
        mpService.navigateTo({ url: 'views/AddLiquidity/bmp/index' })
        setActiveId(1)
      },
    },
    {
      icon: WalletIcon,
      title: t('Wallet'),
      onClick: () => {
        mpService.navigateToMiniProgram({
          appId: 'hhL98uho2A4sGYSHCEdCCo',
          path: 'pages/dashboard/index',
          extraData: {},
        })
      },
    },
  ]
  return (
    <FooterWrap>
      {list.map((item) => (
        <Item key={item.title} {...item} />
      ))}
    </FooterWrap>
  )
}
const { statusBarHeight } = getSystemInfoSync()
const CUSTOM_NAV_HEIGHT = 44
const Page = () => {
  const [activeId, setActiveId] = useState(0)
  return (
    <Providers>
      <StyledPage>
        <CustomNav top={statusBarHeight} height={CUSTOM_NAV_HEIGHT} />
        {activeId === 0 && <Swap />}
        {activeId === 1 && <AddLiquidity />}
        <FooterMenu activeId={activeId} setActiveId={setActiveId} />
        <Footer />
      </StyledPage>
    </Providers>
  )
}
export default Page
