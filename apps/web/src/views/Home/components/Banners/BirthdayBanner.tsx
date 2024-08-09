import { useTranslation } from '@pancakeswap/localization'
import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
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
import { useViewport } from 'hooks/useViewport'

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

const BIRTHDAY_PATH = `${ASSET_CDN}/web/banners/birthday/2024`
const floatingAsset = `${BIRTHDAY_PATH}/floating.png`

const bgSmVariant: GraphicDetail = {
  src: `${BIRTHDAY_PATH}/bg-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${BIRTHDAY_PATH}/bg-md.png`,
  width: 196,
  height: 164,
}

export const BirthdayBanner = () => {
  const { t } = useTranslation()
  const { isMobile, isDesktop, isMd } = useMatchBreakpoints()
  const { width } = useViewport()

  const Action = ({ href, icon, text, ...props }: IActions) => (
    <Box display={props.display} marginTop={props.marginTop}>
      <LinkExternalAction href={href} externalIcon={icon} color={props.color}>
        {t(text)}
      </LinkExternalAction>
    </Box>
  )

  return (
    <BannerContainer background="radial-gradient(110.52% 235.12% at 100% 103.33%, #C4FBFF 0%, #2BD1DE 61.43%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="purple" marginTop={isMd ? '-10px' : '0px'}>
            {t("Pancake4ever! Celebrate PancakeSwap's 4th Birthday with us!")}
          </BannerTitle>
        }
        actions={
          <BannerActionContainer>
            <Action
              // TO-DO Add on Aug 12th
              href=""
              icon="arrowForward"
              alignItems="center"
              text={t('Join Now')}
              color="#280D5F"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic
          src={`${BIRTHDAY_PATH}/bg-lg.png`}
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
