import React, { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { Flex, Button, Svg, Image, Box, EarnFilledIcon, WalletIcon, SwapFillIcon, FarmIcon } from '@pancakeswap/uikit'
import mpService from '@binance/mp-service'
import { useTranslation } from 'contexts/Localization'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
// bmp use full image
import helpImage from '../../../public/images/help-full.png'
import helpLiquidityImage from '../../../public/images/help-liquidity.png'
import CustomNav from './components/CustomNav'
import Providers from '../../PageProvider.bmp'
import AddLiquidity from '../AddLiquidity/bmp/index'
import Swap from '../Swap/bmp/index'
import { LiquidityWrapper } from './components/liquidityWrapper'
import { LiquidityProvider } from './context/swapContext'
import { FarmsProvider } from './context/farmsContext.bmp'
import { FarmsWrapper } from './components/farmsWrapper.bmp'
import ErrorBoundary from 'components/ErrorBoundary'

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

const Footer = ({ activeId = ActiveId.SWAP }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const size = {
    [ActiveId.SWAP]: {
      width: 160,
      height: 128,
    },
    [ActiveId.LIQUIDITY]: {
      width: 97,
      height: 131,
    },
  }
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
      <Image
        src={activeId === ActiveId.SWAP ? helpImage : helpLiquidityImage}
        alt="Get some help"
        {...size[activeId]}
      />
    </Flex>
  )
}

const StyledPage = styled.div`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  min-height: calc(100vh - 64px);
  /* padding: 16px; */
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
      isActive: activeId === ActiveId.SWAP,
      onClick: () => {
        // mpService.navigateTo({ url: 'views/Swap/bmp/index' })
        setActiveId(ActiveId.SWAP)
      },
    },
    {
      icon: EarnFilledIcon,
      title: t('Liquidity'),
      isActive: activeId === ActiveId.LIQUIDITY,
      onClick: () => {
        // mpService.navigateTo({ url: 'views/AddLiquidity/bmp/index' })
        setActiveId(ActiveId.LIQUIDITY)
      },
    },
    {
      icon: FarmIcon,
      title: t('Farms'),
      isActive: activeId === ActiveId.FARMS,
      onClick: () => {
        setActiveId(ActiveId.FARMS)
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
enum ActiveId {
  SWAP,
  LIQUIDITY,
  FARMS,
}
const Page = () => {
  const [activeId, setActiveId] = useState<ActiveId>(ActiveId.SWAP)
  return (
    <Providers>
      <StyledPage style={{ padding: activeId === ActiveId.SWAP || activeId === ActiveId.LIQUIDITY ? '16px' : null }}>
        <CustomNav top={statusBarHeight} height={CUSTOM_NAV_HEIGHT} />
        {activeId === ActiveId.SWAP && <Swap />}
        {activeId === ActiveId.LIQUIDITY && (
          <LiquidityProvider>
            <LiquidityWrapper />
          </LiquidityProvider>
        )}
        {activeId === ActiveId.FARMS && (
          <ErrorBoundary name="farms">
            <FarmsProvider>
              <FarmsWrapper />
            </FarmsProvider>
          </ErrorBoundary>
        )}
        <FooterMenu activeId={activeId} setActiveId={setActiveId} />
        <Footer activeId={activeId} />
      </StyledPage>
    </Providers>
  )
}
export default Page
