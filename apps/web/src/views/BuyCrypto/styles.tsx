import { Box, Flex } from '@pancakeswap/uikit'
import { AppBody } from 'components/App'
import { styled } from 'styled-components'

export const StyledAppBody = styled(AppBody)`
  max-width: 375px;
`

export const Wrapper = styled(Flex)`
  position: relative;
  flex-direction: column;
  justify-content: space-between;
  padding: 0px 1rem 1rem 1rem;
`
export const DropdownWrapper = styled.div<{ isClicked: boolean }>`
  opacity: ${({ isClicked }) => (isClicked ? '0' : '1')};
  width: 100%;
  transition: opacity 0.25s ease-in-out;
`
export const StyledNotificationWrapper = styled.div<{ show: boolean }>`
  display: flex;
  position: relative;
  overflow: hidden;
  padding: ${({ show }) => (show ? '16px 16px' : '0px 16px')};

  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 16px;
  background-color: ${({ theme, show }) => (show ? theme.colors.input : 'transparent')};
  width: 100%;

  transition: background-color 0.6s ease, padding 0.3s ease-in-out;
  border-bottom: 1.2px solid ${({ theme }) => theme.colors.cardBorder};
`

export const Description = styled.div<{ show: boolean; elementHeight: number }>`
  overflow: hidden;
  width: 100%;
  word-break: break-word;
  transition: max-height 0.33s ease-in-out;
  max-height: ${({ show, elementHeight }) => (show ? `${elementHeight}px` : '0px')};
`
export const StyledFeesContainer = styled(Box)`
  &:hover {
    cursor: pointer;
  }
`

export const FilterdNetworkWrapper = styled(Flex)<{ showPopOver: boolean }>`
  position: absolute;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  height: 440px;
  z-index: 1000;
  transition: bottom 0.3s ease-in-out;
  bottom: ${({ showPopOver }) => (!showPopOver ? '-100%' : '-15%')};
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  box-shadow: 6px 20px 12px 8px rgba(74, 74, 104, 0.1);
`
export const NetworkFilterOverlay = styled(Flex)<{ showPopOver: boolean }>`
  position: absolute;
  width: 100%;
  z-index: 1000;

  background-color: #e2d2ff;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ showPopOver }) => (!showPopOver ? '0' : '0.8')};
  pointer-events: ${({ showPopOver }) => (showPopOver ? 'auto' : 'none')};
`
export const StyledIframe = styled.iframe<{ isDark: boolean }>`
  height: 90%;
  width: 100%;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  position: absolute;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
`

export const IFrameWrapper = styled(Flex)`
  height: 90%;
  width: 100%;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => (theme.isDark ? '#27262C' : 'white')};
  position: absolute;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  padding-bottom: 18px;
`
export const StyledBackArrowContainer = styled(Box)`
  position: absolute;
  right: 10%;
  &:hover {
    cursor: pointer;
  }
`

export const ModalHeader = styled.div<{ background?: string }>`
  align-items: center;
  background: transparent;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 12px 24px;
  position: relative;

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ background }) => background || 'transparent'};
  }
`
