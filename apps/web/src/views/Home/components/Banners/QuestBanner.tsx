import { useTranslation } from '@pancakeswap/localization'
import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
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

type ActionsType = { href: string; text: string; icon?: 'arrowForward' | 'openNew' }
type IActions = ActionsType & Partial<CSSStyleDeclaration>

const QUEST_PATH = `${ASSET_CDN}/web/banners/quest`

const bgSmVariant: GraphicDetail = {
  src: `${QUEST_PATH}/bg-md.png`,
  width: 272,
  height: 224,
}

const bgXsVariant: GraphicDetail = {
  src: `${QUEST_PATH}/bg-md.png`,
  width: 196,
  height: 164,
}

export const QuestBanner = () => {
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
    <BannerContainer background="radial-gradient(110.52% 235.12% at 100% 103.33%, #C4FBFF 0%, #2BD1DE 33.33%, #2BD1DE 66.67%, #99F8FF 100%)">
      <BannerMain
        badges={<PancakeSwapBadge />}
        title={
          <BannerTitle variant="yellow" marginTop={isMd ? '-10px' : '0px'}>
            {t('PancakeSwap Quest-Beta Now Live')}
          </BannerTitle>
        }
        desc={
          !isMobile && (
            <BannerDesc style={{ whiteSpace: 'break-spaces' }}>
              {isDesktop
                ? t('Your Multichain Defi Quest Platform - Create your Defi profile now')
                : t('Your Multichain Defi Quest Platform')}
            </BannerDesc>
          )
        }
        actions={
          <BannerActionContainer>
            <Action
              href="https://quest.pancakeswap.finance/quests/a2eeefe4f49b4947a1a14bbff344bbb3"
              icon="arrowForward"
              alignItems="center"
              text={t('Create Your Profile')}
              color="#280D5F"
            />
            <Action
              href="https://blog.pancakeswap.finance/articles/introducing-pancake-swap-quest-beta-your-ultimate-de-fi-quest-platform"
              display={width < 700 ? 'none' : 'flex'}
              icon="openNew"
              alignItems="center"
              text={t('Learn More')}
              color="#280D5F"
            />
          </BannerActionContainer>
        }
      />

      <BannerGraphics>
        <BackgroundGraphic src={`${QUEST_PATH}/bg-lg.png`} sm={bgSmVariant} xs={bgXsVariant} width={469} height={224} />
      </BannerGraphics>
    </BannerContainer>
  )
}
