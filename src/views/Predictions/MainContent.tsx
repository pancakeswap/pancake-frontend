import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ArrowDownIcon, Box, Button, ChartIcon } from '@pancakeswap-libs/uikit'
import { setChartPaneState } from 'state/predictions'
import useI18n from 'hooks/useI18n'
import TradingView from './components/TradingView'
import Positions from './Positions'

interface MainContentProps {
  isHistoryPaneOpen: boolean
  isChartPaneOpen: boolean
}

const PositionsWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  min-height: 480px;
`

const ChartWrapper = styled.div<{ isOpen: boolean }>`
  height: ${({ isOpen }) => (isOpen ? '100%' : 0)};
  overflow: hidden;
`

const Wrapper = styled.div<MainContentProps>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  margin-right: ${({ isHistoryPaneOpen }) => (isHistoryPaneOpen ? '320px' : 0)};
  transition: 300ms ease-in-out;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: ${({ isHistoryPaneOpen }) => (isHistoryPaneOpen ? '384px' : 0)};
  }
`

const ExpandChartButton = styled(Button)`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  color: ${({ theme }) => theme.colors.text};
`

const MainContent: React.FC<MainContentProps> = ({ isHistoryPaneOpen, isChartPaneOpen }) => {
  const TranslateString = useI18n()
  const dispatch = useDispatch()

  const togglePane = () => {
    dispatch(setChartPaneState(!isChartPaneOpen))
  }

  return (
    <Wrapper isHistoryPaneOpen={isHistoryPaneOpen} isChartPaneOpen={isChartPaneOpen}>
      <PositionsWrapper>
        <Positions />
      </PositionsWrapper>
      <Box>
        <ExpandChartButton
          variant="tertiary"
          scale="sm"
          ml="32px"
          startIcon={isChartPaneOpen ? <ArrowDownIcon /> : <ChartIcon />}
          onClick={togglePane}
        >
          {isChartPaneOpen ? TranslateString(438, 'Close') : TranslateString(999, 'Charts')}
        </ExpandChartButton>
      </Box>
      <ChartWrapper isOpen={isChartPaneOpen}>
        <TradingView />
      </ChartWrapper>
    </Wrapper>
  )
}

export default MainContent
