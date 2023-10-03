import { useTranslation } from '@pancakeswap/localization'
import { Button, Text, useMatchBreakpoints, Box, OpenNewIcon } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import { styled } from 'styled-components'
import * as S from './Styled'

const { ETHBunny, ETHXPancakeSwap } = {
  ETHBunny: `${ASSET_CDN}/web/banners/ETHBunny.png`,
  ETHXPancakeSwap: `${ASSET_CDN}/web/banners/ethXpancakeswap.png`,
}

const RightWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: -10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: 1px;
    bottom: -18px;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    right: 0px;
    bottom: -21px;
  }
`
const Title = styled.div`
  font-family: 'Kanit';
  font-style: normal;
  font-weight: 600;
  font-size: 23px;
  line-height: 110%;
  color: #ffffff;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
  margin-bottom: 21px;
  margin-top: 16px;

  @media screen and (max-width: 375px) {
    font-size: 21px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 35px;
    margin-top: 10px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`

const EthBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <S.Wrapper
      style={{
        background: `linear-gradient(128.04deg, #BBD3FB -23.79%, #4B3CFF 121.4%)`,
        overflow: isMobile ? 'hidden' : 'visible',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <Box marginTop="3px">
            <Image src={ETHXPancakeSwap} alt="eth pancake" width={119} height={18} unoptimized />
          </Box>
          <Title>{t('gm eth teams')}</Title>
          <Button
            minHeight="48px"
            onClick={() =>
              window?.open('https://docs.pancakeswap.finance/ethereum-expansion', '_blank', 'noopener noreferrer')
            }
          >
            <Text color="invertedContrast" bold fontSize="16px" mr="4px">
              👋 {t('Get in Touch')}
            </Text>
            <OpenNewIcon color="invertedContrast" />
          </Button>
        </S.LeftWrapper>
        <RightWrapper>
          <Image
            src={ETHBunny}
            alt="ethImage"
            width={isMobile ? 1100 : 930}
            height={isMobile ? 250 : 231}
            unoptimized
          />
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default EthBanner
