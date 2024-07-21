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
import { useViewport } from 'hooks/useViewport'
import { useMemo } from 'react'
import styled from 'styled-components'
// import { ASSETS_CDN } from 'config'

type IActions = { href: string; text: string; icon?: 'arrowForward' | 'openNew' } & Partial<CSSStyleDeclaration>

enum CustomBreakPoints {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
}
const bg = 'radial-gradient(70.49% 124.11% at 44.31% -24.11%, #FEC375 0%, #F68129 18.86%, #EC6357 66.24%, #D8464F 100%)'

const StyledImage = styled.img<{ hidden?: boolean }>`
  display: ${({ hidden }) => (hidden ? 'none' : 'block')};
  width: 45px;
  margin: 0 4px;
`

const bgDesktop = `https://new-assets-for-athletic-bann.assets-agx.pages.dev/web/banners/athletics/athletics-bunnies-lg.png`
const bgMobile = `https://new-assets-for-athletic-bann.assets-agx.pages.dev/web/banners/athletics/athletics-bunnies-md.png`
const rings = `https://new-assets-for-athletic-bann.assets-agx.pages.dev/web/banners/athletics/athletics-top-logo.png`
const ringsAlt = `https://new-assets-for-athletic-bann.assets-agx.pages.dev/web/banners/athletics/athletics-rings.png`

const Titles: { [bp in CustomBreakPoints]: string } = {
  sm: 'PancakeSwap Athletic Games:',
  md: 'PancakeSwap Games: Get Usdt, Merch, and NFTs',
  lg: 'PancakeSwap Athletic Games: Get Usdt, Merch, special edition NFTs',
}

const SubTitles: { [bp in CustomBreakPoints]: string } = {
  sm: 'Get NFTs, merch, and USDT ',
  md: 'Complete tasks for NFTs, merch, and USDT Prises!',
  lg: 'Complete tasks for special edition NFTs, merch, and USDT Prises!',
}

const learnMoreLink = ''
const joinNowLink = ''

const bgSmVariant: GraphicDetail = {
  src: bgMobile,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: bgMobile,
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
          <Flex alignItems="center" justifyContent="center">
            <PancakeSwapBadge compact={width < 450} />
            <StyledImage src={ringsAlt} alt="rings-alt" hidden={isMobile} />
            <StyledImage src={rings} alt="rings" />
          </Flex>
        }
        actions={
          <BannerActionContainer>
            <Action href="" icon="arrowForward" display="flex" text="Join Now" color="#280D5F" />
            <Action href="" icon="openNew" display={isMobile ? 'none' : 'flex'} text="Learn More" color="#280D5F" />
          </BannerActionContainer>
        }
        desc={<BannerDesc style={{ whiteSpace: 'break-spaces' }}>{t(subTitleText)}</BannerDesc>}
        title={<BannerTitle variant={titleVariant}> {t(titleText)}</BannerTitle>}
      />
      <BannerGraphics>
        <BackgroundGraphic src={bgDesktop} width={444} height={224} sm={bgSmVariant} xs={bgXsVariant} />
      </BannerGraphics>
    </BannerContainer>
  )
}
