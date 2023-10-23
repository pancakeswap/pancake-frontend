import { styled } from 'styled-components'
import Split, { SplitInstance } from 'split-grid'
import debounce from 'lodash/debounce'
import delay from 'lodash/delay'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Flex, Box, Button, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { TabToggle } from 'components/TabToggle'
import { usePhishingBanner } from '@pancakeswap/utils/user'
import { useTranslation } from '@pancakeswap/localization'
import { GameType } from '@pancakeswap/games'
import { YoutubeList } from 'views/Game/components/Project/YoutubeList'
import { TextProjectBy } from 'views/Game/components/Project/TextProjectBy'
import { QuickAccess } from 'views/Game/components/Project/QuickAccess'
import { QuickAccessModal } from 'views/Game/components/Project/QuickAccessModal'
import { useGamesConfig } from 'views/Game/hooks/useGamesConfig'

const StyledDesktop = styled.div<{ showPhishingBanner: boolean }>`
  display: flex;
  height: ${({ showPhishingBanner }) =>
    showPhishingBanner ? `calc(100vh - 100px - 84px - 50px)` : `calc(100vh - 99px)`};

  ${({ theme }) => theme.mediaQueries.md} {
    height: ${({ showPhishingBanner }) => (showPhishingBanner ? `calc(100vh - 100px - 69px)` : `calc(100vh - 99px)`)};
  }
`

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 42px;
  ${({ theme }) => theme.mediaQueries.xl} {
    min-height: auto;
  }
`

const SplitWrapper = styled(Box)`
  display: grid;
  flex: 1;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 24px 0;
  overflow: hidden;
`

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  min-height: 500px;
`

const Gutter = styled.div<{ isPaneOpen?: boolean }>`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  cursor: ${({ isPaneOpen }) => (isPaneOpen ? 'row-resize' : 'pointer')};
  height: 24px;

  &:before {
    background-color: ${({ theme }) => theme.colors.textSubtle};
    border-radius: 8px;
    content: '';
    height: 4px;
    left: 50%;
    margin-left: -32px;
    position: absolute;
    top: 10px;
    width: 64px;
  }
`

const ExpandButtonGroup = styled(Flex)`
  position: absolute;
  left: 50%;
  bottom: 24px;
  z-index: 50;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 24px 24px 0 0;
  transform: translateX(-50%);

  ${({ theme }) => theme.mediaQueries.lg} {
    display: inline-flex;
    left: 32px;
    transform: translateX(0%);
  }
`

const VideoPane = styled.div`
  overflow: auto;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`

const GRID_TEMPLATE_ROW = '1.2fr 24px 0.55fr'

export const GameProject = () => {
  const { t } = useTranslation()
  const { query } = useRouter()
  const config = useGamesConfig()
  const { isDesktop } = useMatchBreakpoints()
  const [showPhishingBanner] = usePhishingBanner()

  const gameData: GameType | undefined = useMemo(() => config.find((i) => i.id === query?.projectId), [config, query])

  const splitWrapperRef = useRef<null | HTMLDivElement>(null)
  const videoRef = useRef<null | HTMLDivElement>(null)
  const gutterRef = useRef<null | HTMLDivElement>(null)
  const iframeRef = useRef<null | HTMLIFrameElement>(null)
  const splitInstance = useRef<SplitInstance>()

  const [isPaneOpen, setIsPaneOpen] = useState(false)
  const [onPresentQuickAccessModal] = useModal(<QuickAccessModal game={gameData} />, true, true, 'quick-access-modal')

  useEffect(() => {
    const threshold = 100
    const handleDrag = debounce(() => {
      const videoHeight = videoRef?.current?.getBoundingClientRect?.()

      // If the height of the chart pane goes below the "snapOffset" threshold mark the chart pane as closed
      setIsPaneOpen(Number(videoHeight?.height) > threshold)
    }, 50)

    if (isPaneOpen && !splitInstance.current && gutterRef?.current) {
      splitInstance.current = Split({
        dragInterval: 1,
        snapOffset: threshold,
        onDrag: handleDrag,
        rowGutters: [
          {
            track: 1,
            element: gutterRef.current,
          },
        ],
      })
    } else if (!isPaneOpen && splitInstance.current) {
      splitInstance.current?.destroy()
      splitInstance.current = undefined
    }

    return () => {
      splitInstance.current?.destroy()
      splitInstance.current = undefined
    }
  }, [gutterRef, isPaneOpen])

  const openPane = () => {
    if (splitWrapperRef?.current) {
      splitWrapperRef.current.style.transition = 'grid-template-rows 150ms'
      splitWrapperRef.current.style.gridTemplateRows = GRID_TEMPLATE_ROW

      // Purely comedic: We only want to animate if we are clicking the open chart button
      // If we keep the transition on the resizing becomes very choppy
      delay(() => {
        if (splitWrapperRef?.current) {
          splitWrapperRef.current.style.transition = ''
        }
      }, 150)

      setIsPaneOpen(true)
    }

    delay(() => {
      if (iframeRef?.current) {
        iframeRef.current.style.left = '0'
      }
    }, 425)
  }

  if (!gameData) {
    return null
  }

  return (
    <StyledDesktop showPhishingBanner={showPhishingBanner}>
      <SplitWrapper ref={splitWrapperRef}>
        <StyledContainer>
          <StyledIframe ref={iframeRef} src={gameData.gameLink}>
            {t(`Your browser doesn't support iframe`)}
          </StyledIframe>
        </StyledContainer>
        <Gutter ref={gutterRef} isPaneOpen={isPaneOpen} onClick={() => openPane()}>
          <ExpandButtonGroup>
            <TabToggle
              height="42px"
              as={Button}
              style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
              isActive
              onMouseDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            >
              {t('Learn More')}
            </TabToggle>
            {!isDesktop && (
              <TabToggle
                height="42px"
                as={Button}
                style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onPresentQuickAccessModal()
                }}
              >
                {t('Quick Access')}
              </TabToggle>
            )}
          </ExpandButtonGroup>
          {isDesktop && <QuickAccess game={gameData} />}
          <TextProjectBy game={gameData} />
        </Gutter>
        <VideoPane ref={videoRef}>{isPaneOpen && <YoutubeList playlist={gameData.playlist} />}</VideoPane>
      </SplitWrapper>
    </StyledDesktop>
  )
}
