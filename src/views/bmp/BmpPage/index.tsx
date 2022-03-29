import React from 'react'
import styled, { useTheme } from 'styled-components'
import { Flex, Button, Svg, Image } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
// bmp use full image
import helpImage from '../../../../public/images/help-full.png'
import helpLiquidityImage from '../../../../public/images/help-liquidity.png'
import CustomNav from './components/customNav.bmp'
import Providers from '../../../PageProvider.bmp'
import { ActiveId } from './constants'

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
    [ActiveId.FARMS]: {
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
  overflow-y: scroll;
  padding: 16px 16px 100px 16px;
`
const { statusBarHeight } = getSystemInfoSync()
const CUSTOM_NAV_HEIGHT = 44
const BmpPage = ({ activeId = ActiveId.SWAP, children }) => {
  return (
    <Providers>
      <StyledPage>
        <CustomNav top={statusBarHeight} height={CUSTOM_NAV_HEIGHT} />
        {children}
        <Footer activeId={activeId} />
      </StyledPage>
    </Providers>
  )
}
export default BmpPage
