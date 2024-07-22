import { useTranslation, type TranslateFunction } from '@pancakeswap/localization'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
  BannerDesc,
  BannerGraphics,
  BannerMain,
  BannerTitle,
  LinkExternalAction,
  PancakeSwapBadge,
  type GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useViewport } from 'hooks/useViewport'
import { useMemo } from 'react'
import styled from 'styled-components'

enum CustomBreakPoints {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}

const StyledImage = styled.img<{ hidden?: boolean }>`
  display: ${({ hidden }) => (hidden ? 'none' : 'block')};
  margin: 8px 0 4px 4px;
  width: 45px;
`
const bg = `
  radial-gradient(
    70.49% 124.11% at 44.31% -24.11%, 
    #FEC375 0%, 
    #F68129 18.86%, 
    #EC6357 66.24%, 
    #D8464F 100%
)`

const ATHLETICS_PATH = `${ASSET_CDN}/web/banners/athletics`
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/join-the-pancakeswap-athletic-games-win-usdt-merch-and-special-nfts?utm_source=Homepage&utm_medium=Banner&utm_campaign=AthleticGames&utm_id=AthleticGames'

const bgSmVariant: GraphicDetail = {
  src: `${ATHLETICS_PATH}/athletics-bunnies-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${ATHLETICS_PATH}/athletics-bunnies-md.png`,
  width: 196,
  height: 164,
}

const titleVariant = {
  color: '#280D5F',
  strokeColor: '#ffffff',
  strokeSize: 2,
  fontSize: 28,
  lineHeight: 30,
  fontWeight: 800,
}

const Titles: { [bp in CustomBreakPoints]: (t: TranslateFunction) => string } = {
  sm: (t) => t('PancakeSwap Athletic Games:'),
  md: (t) => t('PancakeSwap Games: Get Usdt, Merch, and NFTs'),
  lg: (t) => t('PancakeSwap Athletic Games: Get Usdt, Merch, special edition NFTs'),
}

const SubTitles: { [bp in CustomBreakPoints]: (t: TranslateFunction) => string } = {
  sm: (t) => t('Get NFTs, merch, and USDT'),
  md: (t) => t('Complete tasks for NFTs, merch, and USDT Prises!'),
  lg: (t) => t('Complete tasks for special edition NFTs, merch, and USDT Prises!'),
}

export const AthleticsBanner = () => {
  const { t } = useTranslation()
  const { width } = useViewport()
  const { isMobile } = useMatchBreakpoints()

  const titleText = useMemo(() => {
    if (width < 800) return Titles.sm(t)
    if (width < 1040) return Titles.md(t)
    return Titles.lg(t)
  }, [width, t])

  const subTitleText = useMemo(() => {
    if (width < 800) return SubTitles.sm(t)
    if (width < 1040) return SubTitles.md(t)
    return SubTitles.lg(t)
  }, [width, t])

  return (
    <BannerContainer background={bg}>
      <BannerMain
        badges={
          <Flex alignItems="center" justifyContent="center" alignContent="center" height="20px">
            <PancakeSwapBadge compact={width < 450} />
            <StyledImage src={`${ATHLETICS_PATH}/athletics-rings.png`} alt="rings-alt" hidden={isMobile} />
            <StyledImage src={`${ATHLETICS_PATH}/athletics-top-logo.png`} alt="top-logo-alt" />
          </Flex>
        }
        title={
          <BannerTitle variant={titleVariant} marginTop="-2px">
            {t(titleText)}
          </BannerTitle>
        }
        desc={<BannerDesc style={{ whiteSpace: 'break-spaces' }}>{t(subTitleText)}</BannerDesc>}
        actions={
          <BannerActionContainer>
            <LinkExternalAction href={learnMoreLink} externalIcon="arrowForward" color="#280D5F">
              {t('Join Now!')}
            </LinkExternalAction>
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic
          src={`${ATHLETICS_PATH}/athletics-bunnies-lg.png`}
          sm={bgSmVariant}
          xs={bgXsVariant}
          width={469}
          height={224}
        />
      </BannerGraphics>
    </BannerContainer>
  )
}
