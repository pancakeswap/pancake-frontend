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

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

const StyledImage = styled.img`
  margin-left: 10px;
  width: 76px;
  height: 20px;
`

const HACKATHON_PATH = `${ASSET_CDN}/web/banners/v4-hackathon`
const floatingAsset = `${HACKATHON_PATH}/floating.png`
const logoLarge = `${HACKATHON_PATH}/top-logo.png`

const bgSmVariant: GraphicDetail = {
  src: `${HACKATHON_PATH}/bg-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${HACKATHON_PATH}/bg-md.png`,
  width: 196,
  height: 164,
}

const yellowVariant = {
  color: '#F4D045',
  strokeColor: '#1C0053',
  strokeSize: 2.5,
  fontSize: 36,
  lineHeight: 30,
  fontWeight: 900,
}

export const V4HackathonBanner = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const Action = ({ href, icon, text, ...props }: IActions) => (
    <Box display={props.display}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color}>
        {t(text)}
      </LinkExternalAction>
    </Box>
  )

  return (
    <BannerContainer background="linear-gradient(165.96deg, #3D1A8A -96.52%, #4B22A5 47.91%, #2A1063 68.78%)">
      <BannerMain
        badges={
          <Flex alignItems="center" justifyContent="center" alignContent="center" height="20px" minWidth="220px">
            <PancakeSwapBadge whiteText />
            <StyledImage src={logoLarge} alt="top-logo-alt" />
          </Flex>
        }
        title={<BannerTitle variant={yellowVariant}>{t('v4 Hookathon')}</BannerTitle>}
        desc={
          !isMobile && (
            <BannerDesc style={{ whiteSpace: 'break-spaces' }} color="white">
              {t('Build Hooks on PancakeSwap v4: $40,000 Total Prize Pool')}
            </BannerDesc>
          )
        }
        actions={
          <BannerActionContainer>
            <Action
              href="https://dorahacks.io/hackathon/v4hookathon/detail"
              display={isMobile ? 'none' : 'flex'}
              icon="arrowForward"
              alignItems="center"
              text={t('Start Building')}
              color="white"
            />
            <Action
              href="https://blog.pancakeswap.finance/articles/announcing-the-v4-hookathon-pancake-swap-x-brevis-hackathon"
              icon="openNew"
              display="flex"
              alignItems="center"
              text={t('Learn More')}
              color="white"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic
          src={`${HACKATHON_PATH}/bg-lg.png`}
          sm={bgSmVariant}
          xs={bgXsVariant}
          width={469}
          height={224}
        />
        <Box position="absolute" width="100%">
          <FloatingGraphic src={floatingAsset} width={99} height={99} />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
