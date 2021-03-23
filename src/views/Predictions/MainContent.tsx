import React from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { ArrowDownIcon, Button, ChartIcon } from '@pancakeswap-libs/uikit'
import { setChartPaneState } from 'state/predictions'
import useI18n from 'hooks/useI18n'
import TradingView from './components/TradingView'
import MobileNavigation from './components/MobileMenu'
import Positions from './Positions'

interface MainContentProps {
  isHistoryPaneOpen: boolean
  isChartPaneOpen: boolean
}

const PositionsWrapper = styled.div<{ isChartPaneOpen: boolean }>`
  align-items: ${({ isChartPaneOpen }) => (isChartPaneOpen ? 'start' : 'center')};
  display: flex;
  flex: 1;
  min-height: 513px;
`

const ChartWrapper = styled.div<{ isOpen: boolean }>`
  bottom: 64px;
  height: ${({ isOpen }) => (isOpen ? 'calc(100% - 144px)' : 0)};
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 50;

  ${({ theme }) => theme.mediaQueries.lg} {
    bottom: auto;
    height: ${({ isOpen }) => (isOpen ? '100%' : 0)};
    left: auto;
    position: relative;
  }
`

const Wrapper = styled.div<MainContentProps>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  transition: 200ms ease-in-out;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-right: ${({ isHistoryPaneOpen }) => (isHistoryPaneOpen ? '384px' : 0)};
  }
`

const ExpandChartButton = styled(Button)`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  color: ${({ theme }) => theme.colors.text};
  display: none;
  left: 32px;
  position: absolute;
  top: -32px;
  z-index: 50;

  &:hover:not(:disabled):not(.pancake-button--disabled):not(.pancake-button--disabled):not(:active) {
    background-color: ${({ theme }) => theme.card.background};
    opacity: 1;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    display: inline-flex;
  }
`

const MainContent: React.FC<MainContentProps> = ({ isHistoryPaneOpen, isChartPaneOpen }) => {
  const TranslateString = useI18n()
  const dispatch = useDispatch()

  const togglePane = () => {
    dispatch(setChartPaneState(!isChartPaneOpen))
  }

  return (
    <Wrapper isHistoryPaneOpen={isHistoryPaneOpen} isChartPaneOpen={isChartPaneOpen}>
      <PositionsWrapper isChartPaneOpen={isChartPaneOpen}>
        <Positions />
      </PositionsWrapper>
      <ChartWrapper isOpen={isChartPaneOpen}>
        <ExpandChartButton
          variant="tertiary"
          scale="sm"
          startIcon={isChartPaneOpen ? <ArrowDownIcon /> : <ChartIcon />}
          onClick={togglePane}
        >
          {isChartPaneOpen ? TranslateString(438, 'Close') : TranslateString(999, 'Charts')}
        </ExpandChartButton>
        <TradingView />
      </ChartWrapper>
      <MobileNavigation />
    </Wrapper>
  )
}

export default MainContent
