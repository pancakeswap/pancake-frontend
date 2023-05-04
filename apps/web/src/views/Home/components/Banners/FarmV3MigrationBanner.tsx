import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Flex,
  NextLinkFromReactRouter,
  Text,
  useMatchBreakpoints,
  OpenNewIcon,
  ArrowForwardIcon,
  LogoIcon,
} from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import Image from 'next/legacy/image'
import styled, { css } from 'styled-components'
import * as S from './Styled'

const { farmV3MigrationBunny, farmV3MigrationMobileBunny } = {
  farmV3MigrationBunny: `${ASSET_CDN}/web/banners/farmV3MigrationBunny.png`,
  farmV3MigrationMobileBunny: `${ASSET_CDN}/web/banners/farmV3MigrationMobileBunny.png`,
}

const RightWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  right: 0;
  top: 0;
  overflow: visible;

  > span:first-child {
    position: absolute !important;
    right: 0px;
    bottom: 0px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    > span:first-child {
      right: 18px;
    }
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
  padding-right: 80px;

  @media screen and (max-width: 375px) {
    font-size: 21px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 26px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
    padding-right: 0px;
  }
`
const StyledBox = styled(Box)`
  font-weight: 600;
  font-size: 12px;
  line-height: 110%;
  font-feature-settings: 'liga' off;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 8px;
  padding-right: 120px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 21px;
    margin-bottom: 16px;
    width: 100%;
    padding-right: 140px;
  }
`

const sharedStyle = css`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    border-radius: 16px;
  }
`

const StyledButtonLeft = styled(Button)`
  ${sharedStyle}
  > div {
    color: ${({ theme }) => theme.colors.white};
  }
`

const StyledButtonRight = styled(Button)`
  ${sharedStyle}
  background-color: ${({ theme }) => theme.colors.white};
  > div {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const FarmV3MigrationBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useMatchBreakpoints()

  return (
    <S.Wrapper
      style={{
        background:
          'linear-gradient(261.24deg, rgba(158, 63, 253, 0.1225) 27.61%, rgba(98, 61, 255, 0.25) 76.11%), linear-gradient(247.24deg, #53DEE9 -16.43%, #A881FC 92.15%)',
      }}
    >
      <S.Inner>
        <S.LeftWrapper>
          <Flex flexDirection={['column', 'row']} mb={['8px', '8px', '12px']}>
            {isMobile && <LogoIcon mr={['auto', '8px']} width={24} height={24} />}
            <Title>{isMobile ? t('PCS v3 Migration') : t('PancakeSwap v3 Migration')}</Title>
          </Flex>
          <StyledBox>{t('Migrate to continue farming CAKE rewards and earning trading fees.')}</StyledBox>
          <Flex style={{ gap: 8 }} flexWrap={isMobile ? 'wrap' : 'nowrap'}>
            <NextLinkFromReactRouter to="/migration">
              <StyledButtonLeft scale={isMobile ? 'sm' : 'md'}>
                <Text bold fontSize="16px" mr="4px">
                  {`${t('Proceed')} ${isMobile ? '👈' : ''}`}
                </Text>
                {!isMobile && <ArrowForwardIcon color="white" />}
              </StyledButtonLeft>
            </NextLinkFromReactRouter>
            <NextLinkFromReactRouter
              target="_blank"
              to="https://docs.pancakeswap.finance/code/v3-migration/how-to-migrate"
              rel='"noopener noreferrer'
            >
              <StyledButtonRight scale={isMobile ? 'sm' : 'md'}>
                <Text bold fontSize="16px" mr="4px">
                  {t('Guide')}
                </Text>
                <OpenNewIcon color="primary" />
              </StyledButtonRight>
            </NextLinkFromReactRouter>
          </Flex>
        </S.LeftWrapper>
        <RightWrapper>
          {isMobile || isTablet ? (
            <Image
              src={farmV3MigrationMobileBunny}
              alt="farmV3MigrationMobileBunny"
              width={200}
              height={200}
              unoptimized
            />
          ) : (
            <Image src={farmV3MigrationBunny} alt="farmV3MigrationBunny" width={300} height={230} unoptimized />
          )}
        </RightWrapper>
      </S.Inner>
    </S.Wrapper>
  )
}

export default FarmV3MigrationBanner
