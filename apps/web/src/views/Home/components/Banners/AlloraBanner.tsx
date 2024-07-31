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
  CoBrandBadge,
  FloatingGraphic,
  LinkExternalAction,
  type GraphicDetail,
} from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

const ALLORA_PATH = `${ASSET_CDN}/web/banners/allora`
const floatingAsset = `${ALLORA_PATH}/floating-coin.png`
const logoSmall = `${ALLORA_PATH}/logo-md.png`
const logoLarge = `${ALLORA_PATH}/logo-lg.png`

const bgSmVariant: GraphicDetail = {
  src: `${ALLORA_PATH}/bg-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${ALLORA_PATH}/bg-md.png`,
  width: 196,
  height: 164,
}

export const AlloraBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop, isTablet, isXl } = useMatchBreakpoints()

  const Action = ({ href, icon, text, ...props }: IActions) => (
    <Box display={props.display}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color}>
        {t(text)}
      </LinkExternalAction>
    </Box>
  )

  return (
    <BannerContainer background="radial-gradient(63% 84% at 26% 23%, #CBD7EF 0%, #A3A9D5 72.82%, #9A9FD0 100%)">
      <BannerMain
        badges={
          <Flex minWidth="max-content">
            <CoBrandBadge
              coBrand={isMobile ? logoSmall : logoLarge}
              coBrandLogo={isMobile ? logoSmall : logoLarge}
              cHeight={isMobile ? 22 : 32}
              cWidth={isMobile ? 58 : 100}
              dividerBg="#08080844"
            />
          </Flex>
        }
        title={
          <BannerTitle variant="purple" marginTop={isTablet || isXl ? '-12px' : '0px'}>
            {t('Earn Allora Points on PancakeSwap')}
          </BannerTitle>
        }
        desc={
          !isMobile && (
            <BannerDesc style={{ whiteSpace: 'break-spaces' }}>
              {isDesktop
                ? t('Predict the price of ETH on Arbitrum and join the Galxe campaign to earn Allora points')
                : t('Predict the price of ETH & join the Galxe campaign')}
            </BannerDesc>
          )
        }
        actions={
          <BannerActionContainer>
            <Action
              href="https://pancakeswap.finance/prediction?token=ETH&chain=arb&utm_source=homepagebanner&utm_medium=website&utm_campaign=Arbitrum&utm_id=AlloraPointsPrediction"
              display={isMobile ? 'none' : 'flex'}
              icon="arrowForward"
              alignItems="center"
              text="Join now"
              color="#280D5F"
            />
            <Action
              href="https://www.allora.network/blog/announcing-the-allora-x-pancakeswap-points-program"
              icon="openNew"
              display="flex"
              alignItems="center"
              text="Learn More"
              color="#280D5F"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic
          src={`${ALLORA_PATH}/bg-lg.png`}
          sm={bgSmVariant}
          xs={bgXsVariant}
          width={469}
          height={224}
        />
        <Box position="absolute" width="100%" left="3%">
          <FloatingGraphic src={floatingAsset} width={99} height={99} />
        </Box>
      </BannerGraphics>
    </BannerContainer>
  )
}
