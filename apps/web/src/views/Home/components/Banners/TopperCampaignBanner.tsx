import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import {
  BackgroundGraphic,
  BannerActionContainer,
  BannerContainer,
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

const StyledImage = styled.img`
  margin: 8px 0 4px 8px;
`
const StyledBackgroundGraphic = styled(BackgroundGraphic)`
  left: calc(100% - 196px);

  ${({ theme }) => theme.mediaQueries.sm} {
    left: calc(100% - 272px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    left: 5%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    left: 50%;
    transform: translateX(-50%);
  }
`

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

const TOPPER_PATH = `${ASSET_CDN}/web/banners/topper-banner`
const floatingAsset = `${TOPPER_PATH}/floating.png`

const bgSmVariant: GraphicDetail = {
  src: `${TOPPER_PATH}/bunny-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${TOPPER_PATH}/bunny-md.png`,
  width: 196,
  height: 164,
}

const whiteVariant = {
  color: '#ffffff',
  strokeColor: 'transparent',
  strokeSize: 2,
  fontSize: 28,
  lineHeight: 30,
  fontWeight: 800,
}

export const TopperCampaignBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isSm } = useMatchBreakpoints()

  const Action = ({ href, icon, text, ...props }: IActions) => (
    <Box display={props.display}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color}>
        {text}
      </LinkExternalAction>
    </Box>
  )

  return (
    <BannerContainer background="linear-gradient(280.93deg, #5AE18C 4.82%, #006B3F 111.24%)">
      <BannerMain
        badges={
          <Flex alignItems="center" justifyContent="center" alignContent="center" minWidth="205px">
            <PancakeSwapBadge whiteText />
            <StyledImage src={`${TOPPER_PATH}/topper-badge-md.png`} alt="top-logo-alt" width="78px" height="23px" />
          </Flex>
        }
        title={
          <BannerTitle variant={whiteVariant} marginTop={isSm ? '-6px' : '0px'}>
            {t('Enjoy 0% Provider Fees For 2 Weeks Only!')}
          </BannerTitle>
        }
        actions={
          <BannerActionContainer>
            <Action
              href="https://pancakeswap.finance/buy-crypto"
              display="flex"
              icon="arrowForward"
              alignItems="center"
              text={t('Buy now')}
              color="rgba(255, 229, 191, 1)"
            />
            <Action
              href="https://blog.pancakeswap.finance/articles/pancake-swap-integrates-with-topper-to-expand-crypto-access"
              icon="openNew"
              display={isMobile ? 'none' : 'flex'}
              alignItems="center"
              text={t('Learn More')}
              color="rgba(255, 229, 191, 1)"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <StyledBackgroundGraphic
          src={`${TOPPER_PATH}/bunny-lg.png`}
          sm={bgSmVariant}
          xs={bgXsVariant}
          width={469}
          height={224}
          className=""
        />
        <Box position="absolute" width="100%" left="3%">
          <FloatingGraphic src={floatingAsset} width={99} height={99} />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
