import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
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
// import { ASSETS_CDN } from 'config'
import { useViewport } from 'hooks/useViewport'
import { useMemo } from 'react'
import styled from 'styled-components'

type IActions = {
  href: string
  text: string
  icon?: 'arrowForward' | 'openNew'
} & Partial<CSSStyleDeclaration>

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

const ASSETS_CDN = 'https://new-assets-for-athletic-bann.assets-agx.pages.dev'
const ATHLETICS_PATH = `${ASSETS_CDN}/web/banners/athletics`
const learnMoreLink = ''
const joinNowLink = ''

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

const Titles: { [bp in CustomBreakPoints]: string } = {
  sm: 'PancakeSwap Athletic Games:',
  md: 'PancakeSwap Games: Get Usdt, Merch, and NFTs',
  lg: 'PancakeSwap Athletic Games: Get Usdt, Merch, special edition NFTs',
}

const SubTitles: { [bp in CustomBreakPoints]: string } = {
  sm: 'Get NFTs, merch, and USDT',
  md: 'Complete tasks for NFTs, merch, and USDT Prises!',
  lg: 'Complete tasks for special edition NFTs, merch, and USDT Prises!',
}

export const AthleticsBanner = () => {
  const { t } = useTranslation()
  const { width } = useViewport()
  const { isMobile } = useMatchBreakpoints()

  const titleText = useMemo(() => {
    if (width < 800) return Titles.sm
    if (width < 1040) return Titles.md
    return Titles.lg
  }, [width])

  const subTitleText = useMemo(() => {
    if (width < 800) return SubTitles.sm
    if (width < 1040) return SubTitles.md
    return SubTitles.lg
  }, [width])

  const Action = ({ href, icon, text, ...props }: IActions) => (
    <Box display={props.display}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color}>
        {t(text)}
      </LinkExternalAction>
    </Box>
  )

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
        actions={
          <BannerActionContainer>
            <Action
              href={learnMoreLink}
              icon="arrowForward"
              display="flex"
              alignItems="center"
              text="Join Now"
              color="#280D5F"
            />
            <Action
              href={joinNowLink}
              display={isMobile ? 'none' : 'flex'}
              icon="openNew"
              alignItems="center"
              text="Learn More"
              color="#280D5F"
            />
          </BannerActionContainer>
        }
        desc={<BannerDesc style={{ whiteSpace: 'break-spaces' }}>{t(subTitleText)}</BannerDesc>}
        title={
          <BannerTitle variant={titleVariant} marginTop="-2px">
            {t(titleText)}
          </BannerTitle>
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
