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
  FloatingGraphic,
  LinkExternalAction,
  PancakeSwapBadge,
  type GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import styled from 'styled-components'

type IActions = {
  href: string
  text: string
  icon?: 'arrowForward' | 'openNew'
} & Partial<CSSStyleDeclaration>

const StyledImage = styled.img<{ hidden?: boolean }>`
  display: ${({ hidden }) => (hidden ? 'none' : 'block')};
  margin: 8px 0 4px 4px;
  width: 85px;
`

const OORT_PATH = `${ASSET_CDN}/web/banners/oort`
const floatingAsset = `${ASSET_CDN}/web/banners/oort/oort-coin.png`

const tradeNowLink =
  '/swap?outputCurrency=0x5651fA7a726B9Ec0cAd00Ee140179912B6E73599&utm_source=PCSWebsite&utm_medium=HomePageBanner&utm_campaign=SwapOORT&utm_id=OORTTradingCompetition'
const learnMoreLink =
  'https://blog.pancakeswap.finance/articles/join-the-oort-trading-competition-on-pancake-swap-to-win-50-000?utm_source=PCSWebsite&utm_medium=HomePageBanner&utm_campaign=SwapOORT&utm_id=OORTTradingCompetition'

const bgSmVariant: GraphicDetail = {
  src: `${OORT_PATH}/bunnies-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${OORT_PATH}/bunnies-md.png`,
  width: 196,
  height: 164,
}

const titleVariant = {
  color: 'rgba(33, 75, 247, 1)',
  strokeColor: '#ffffff',
  strokeSize: 2,
  fontSize: 28,
  lineHeight: 30,
  fontWeight: 800,
}

const Action = ({ href, icon, text, ...props }: IActions) => {
  return (
    <Box display={props.display}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color}>
        {text}
      </LinkExternalAction>
    </Box>
  )
}

export const OortTradingBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop } = useMatchBreakpoints()

  return (
    <BannerContainer background={`url(${ASSET_CDN}/web/banners/oort/bg.png)`}>
      <BannerMain
        badges={
          <Flex alignItems="center" justifyContent="center" alignContent="center" height="20px" minWidth="220px">
            <PancakeSwapBadge />
            <StyledImage src={`${OORT_PATH}/oort-logo.png`} alt="top-logo-alt" />
          </Flex>
        }
        title={
          <BannerTitle variant={titleVariant} marginTop="-2px">
            {t('Win $50,000 in OORT Trading Competition!')}
          </BannerTitle>
        }
        desc={
          isMobile ? null : (
            <BannerDesc style={{ whiteSpace: 'break-spaces' }} color="secondary">
              {isDesktop
                ? t('Win guaranteed prize, leaderboard prize, and daily lucky draws')
                : t('Trade OORT to win guaranteed prizes!')}
            </BannerDesc>
          )
        }
        actions={
          <BannerActionContainer>
            <Action
              href={tradeNowLink}
              display={isMobile ? 'none' : 'flex'}
              icon="arrowForward"
              alignItems="center"
              text={t('Trade Now')}
              color="#280D5F"
            />
            <Action
              href={learnMoreLink}
              icon="openNew"
              display="flex"
              alignItems="center"
              text={t('Learn More')}
              color="#280D5F"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic
          src={`${OORT_PATH}/bunnies-lg.png`}
          sm={bgSmVariant}
          xs={bgXsVariant}
          width={469}
          height={224}
        />
        <Box position="absolute" width="100%" left={isMobile ? '10%' : '3%'}>
          <FloatingGraphic src={floatingAsset} width={99} height={99} />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
