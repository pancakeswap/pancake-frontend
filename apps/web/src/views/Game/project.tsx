import { styled } from 'styled-components'
import Split, { SplitInstance } from 'split-grid'
import debounce from 'lodash/debounce'
import delay from 'lodash/delay'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { Flex, Box, Button } from '@pancakeswap/uikit'
import { TabToggle } from 'components/TabToggle'
import { useTranslation } from '@pancakeswap/localization'

const StyledDesktop = styled.div`
  display: flex;
  height: calc(100vh - 100px - 66px);
`

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const SplitWrapper = styled(Box)`
  display: grid;
  flex: 1;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 24px 0;
  overflow: hidden;
`

const StyledIframe = styled.iframe`
  top: 0;
  left: 0 !important;
  width: 100%;
  height: 100%;
`

const Gutter = styled.div<{ isPaneOpen?: boolean }>`
  background: ${({ theme }) => theme.card.background};
  cursor: ${({ isPaneOpen }) => (isPaneOpen ? 'row-resize' : 'pointer')};
  height: 24px;
  position: relative;

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
  bottom: 24px;
  left: 32px;
  position: absolute;
  display: none;
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: 24px 24px 0 0;
  z-index: 50;
  ${({ theme }) => theme.mediaQueries.lg} {
    display: inline-flex;
  }
`

const VideoPane = styled.div`
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.background};
`

const GRID_TEMPLATE_ROW = '1.2fr 24px 0.8fr'

export const GameProject = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const splitWrapperRef = useRef<null | HTMLDivElement>(null)
  const videoRef = useRef<null | HTMLDivElement>(null)
  const gutterRef = useRef<null | HTMLDivElement>(null)
  const splitInstance = useRef<SplitInstance>()

  const [isPaneOpen, setIsPaneOpen] = useState(false)

  // router.query.projectId

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
      }, 1500)

      setIsPaneOpen(true)
    }
  }

  // unmount
  useEffect(() => {
    return () => {
      setIsPaneOpen(false)
    }
  }, [])

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

  return (
    <StyledDesktop>
      <SplitWrapper ref={splitWrapperRef}>
        <StyledContainer>
          <StyledIframe src="https://protectors.pancakeswap.finance/">
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
              // isActive={chartView === PredictionsChartView.TradingView}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
                // dispatch(setChartView(PredictionsChartView.TradingView))
              }}
            >
              Playlist title 1
            </TabToggle>
            <TabToggle
              as={Button}
              height="42px"
              style={{ whiteSpace: 'nowrap', alignItems: 'center' }}
              // isActive={chartView === PredictionsChartView.Chainlink}
              onMouseDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
                // dispatch(setChartView(PredictionsChartView.Chainlink))
              }}
            >
              Playlist title 2
            </TabToggle>
          </ExpandButtonGroup>
        </Gutter>
        <VideoPane ref={videoRef}>{isPaneOpen && <Box>123123</Box>}</VideoPane>
      </SplitWrapper>
    </StyledDesktop>
  )
}
