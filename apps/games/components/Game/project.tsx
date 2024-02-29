import { GameType } from '@pancakeswap/games'
import { useTranslation } from '@pancakeswap/localization'
import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { DesktopView } from 'components/Game/Project/DesktopView'
import { MobileView } from 'components/Game/Project/MobileView'
import { useGamesConfig } from 'hooks/useGamesConfig'
import { useRouter } from 'next/router'
import { useMemo, useRef } from 'react'
import { styled } from 'styled-components'

const StyledDesktop = styled.div`
  display: flex;
  height: calc(100vh - 56px - 42px);

  ${({ theme }) => theme.mediaQueries.lg} {
    height: calc(100vh - 56px);
  }
`

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  ${({ theme }) => theme.mediaQueries.xl} {
    min-height: auto;
  }
`

const SplitWrapper = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    flex: 1;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 24px 0;
    overflow: hidden;
  }
`

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
`

export const GameProject = () => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const config = useGamesConfig()
  const iframeRef = useRef<null | HTMLIFrameElement>(null)
  const { isDesktop } = useMatchBreakpoints()

  const gameData: GameType | undefined = useMemo(() => config.find((i) => i.id === query?.projectId), [config, query])

  const splitWrapperRef = useRef<null | HTMLDivElement>(null)

  const gameUrl = useMemo(() => {
    const defaultUrl = gameData?.gameLink?.playNowLink
    return query?.gameSearch ? `${defaultUrl}${query?.gameSearch}` : defaultUrl
  }, [gameData, query])

  if (!gameData) {
    return null
  }

  return (
    <StyledDesktop>
      <SplitWrapper ref={splitWrapperRef}>
        <StyledContainer>
          <StyledIframe ref={iframeRef} src={gameUrl}>
            {t(`Your browser doesn't support iframe`)}
          </StyledIframe>
        </StyledContainer>
        {isDesktop ? (
          <DesktopView iframeRef={iframeRef} splitWrapperRef={splitWrapperRef} gameData={gameData} />
        ) : (
          <MobileView gameData={gameData} />
        )}
      </SplitWrapper>
    </StyledDesktop>
  )
}
