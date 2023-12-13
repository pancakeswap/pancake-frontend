/* eslint-disable no-param-reassign */
import { styled } from 'styled-components'
import Split, { SplitInstance } from 'split-grid'
import debounce from 'lodash/debounce'
import delay from 'lodash/delay'
import { useTranslation } from '@pancakeswap/localization'
import { useState, useEffect, useRef, useMemo, MutableRefObject } from 'react'
import { Flex, Button } from '@pancakeswap/uikit'
import { TabToggle } from 'components/TabToggle'
import { GameType } from '@pancakeswap/games'
import { YoutubeList } from 'components/Game/Project/YoutubeList'
import { TextProjectBy } from 'components/Game/Project/TextProjectBy'
import { QuickAccess } from 'components/Game/Project/QuickAccess'

const Gutter = styled.div`
  position: relative;
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  height: 24px;
`

const GrabLine = styled.div<{ isPaneOpen?: boolean; hasPlayList?: boolean }>`
  display: ${({ hasPlayList }) => (hasPlayList ? 'block' : 'none')};
  background-color: ${({ theme }) => theme.colors.textSubtle};
  border-radius: 8px;
  content: '';
  height: 4px;
  left: 50%;
  margin-left: -32px;
  position: absolute;
  top: 10px;
  width: 64px;
  cursor: ${({ isPaneOpen }) => (isPaneOpen ? 'row-resize' : 'pointer')};
`

const ExpandButtonGroup = styled(Flex)`
  position: absolute;
  left: 32px;
  bottom: 24px;
  z-index: 50;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 24px 24px 0 0;
  transform: translateX(0%);
  display: inline-flex;
`

const VideoPane = styled.div`
  overflow: auto;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`

const GRID_TEMPLATE_ROW = '1.2fr 24px 0.55fr'

interface OnMouseDownType {
  stopPropagation: () => void
  preventDefault: () => void
}

interface DesktopViewProps {
  gameData: GameType
  iframeRef: MutableRefObject<HTMLDivElement | null>
  splitWrapperRef: MutableRefObject<HTMLDivElement | null>
}

export const DesktopView: React.FC<React.PropsWithChildren<DesktopViewProps>> = ({
  gameData,
  iframeRef,
  splitWrapperRef,
}) => {
  const { t } = useTranslation()

  const videoRef = useRef<null | HTMLDivElement>(null)
  const gutterRef = useRef<null | HTMLDivElement>(null)
  const splitInstance = useRef<SplitInstance>()

  const [isPaneOpen, setIsPaneOpen] = useState(false)

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
    if (hasPlayList) {
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
  }

  const hasPlayList = useMemo(() => Number(gameData?.playlist?.length) > 0, [gameData])

  return (
    <>
      <Gutter ref={gutterRef}>
        <GrabLine isPaneOpen={isPaneOpen} hasPlayList={hasPlayList} onClick={openPane} />
        <ExpandButtonGroup>
          {hasPlayList && (
            <>
              <TabToggle
                height="42px"
                as={Button}
                style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
                isActive
                onMouseDown={(e: OnMouseDownType) => {
                  e.stopPropagation()
                  e.preventDefault()
                  openPane()
                }}
              >
                {t('Learn More')}
              </TabToggle>
            </>
          )}
        </ExpandButtonGroup>
        <QuickAccess game={gameData} />
        <TextProjectBy game={gameData} />
      </Gutter>
      <VideoPane ref={videoRef}>{isPaneOpen && <YoutubeList playlist={gameData.playlist} />}</VideoPane>
    </>
  )
}
