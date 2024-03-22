import { Colors, Flex } from '@pancakeswap/uikit'
import Link from 'next/link'
import styled, { keyframes } from 'styled-components'

// Notification View styles
export const Menu = styled.div<{ $isOpen: boolean; $overrideHeight: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 24px;
  // padding-bottom: 4px;
  pointer-events: auto;
  width: 400px;
  overflow: hidden;
  position: relative;
  visibility: visible;
  z-index: 1001;

  ${({ $isOpen }) =>
    !$isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
  `}
  ${({ $overrideHeight }) =>
    $overrideHeight &&
    `
    height: 520px;
  `}
`

export const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

export const ModalHeader = styled.div<{ background?: string }>`
  align-items: center;
  background: transparent;
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    background: ${({ background }) => background || 'transparent'};
  }
`

export const StyledInputCurrencyWrapper = styled.div`
  display: flex;
  position: relative;
  overflow: hidden;
  width: 200%; /* Specify the width of the container */
  height: 200%; /* Specify the height of the container */
  min-height: 450px;
`
export const ViewContainer = styled.div<{ $viewIndex: number }>`
  display: flex;
  width: 300%;
  transition: transform 300ms ease-in-out;
  transform: translateX(${({ $viewIndex }) => ($viewIndex === 0 ? '0%' : $viewIndex === 1 ? '-33.33%' : '-66.66%')});
`

export const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
  justify-content: center;
`
export const openRight = keyframes` 
    0% {
        right: -150%;
    }
    100% {
        right: 0%;
    }
`

export const closeRight = keyframes` 
    0% {
        right: 0%;
    }
    100% {
        right: -150%;
    }
`
export const openLeft = keyframes` 
    0% {
        right: 150%;
    }
    100% {
        right: 0%;
    }
`

export const NoNotificationsWrapper = styled.div`
  animation-fill-mode: forwards;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 390px;
  animation: ${() => openLeft} 0.65s;
`

export const NotificationsWrapper = styled.div`
  animation-fill-mode: forwards;
  position: relative;
`

export const NotificationContainerStyled = styled.div<{ $maxHeight: string }>`
  height: ${({ $maxHeight }) => $maxHeight};
  max-height: ${({ $maxHeight }) => $maxHeight};
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.cardBorder};
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px ${({ theme }) => theme.colors.input};
    border-radius: 10px;
  }
`

export const StyledNotificationWrapper = styled.div`
  animation-fill-mode: forwards;
  display: flex;
  position: relative;
  overflow: hidden;
  padding: 20px 24px 20px 24px;
  animation: ${() => openRight} 0.65s;

  transition: transform 0.3s;
  background-color: transparent;
  width: 100%;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => (theme.isDark ? '#372F46' : theme.colors.background)};
  }

  transition: background-color 0.15s ease;
  border-bottom: 1.2px solid ${({ theme }) => theme.colors.cardBorder};
`

export const ContentsContainer = styled.div`
  display: flex;
  align-items: flex-start;

  overflow: hidden;
  width: 100%;
`

export const Description = styled.div<{ show: boolean; elementHeight: number }>`
  overflow: hidden;
  max-width: 100%;
  margin-top: 8px;
  word-break: break-word;
  transition: max-height 0.33s ease-in-out;
  max-height: ${({ show, elementHeight }) => (show ? `${elementHeight}px` : '37px')};
`

export const ExpandButton = styled.div`
  pointer-events: none;
`

export const StyledLink = styled(Link)<{ hidden?: boolean }>`
  max-height: 45px;
  height: 45px;
  width: 100%;
  border-radius: 16px;
  background: ${({ theme }) => `${theme.colors.primary}`};
  color: ${({ theme }) => `${theme.colors.background}`};
  font-weight: bold;
  display: ${({ hidden }) => `${hidden ? 'none' : 'flex'}`};
  margin-top: 12px;
  justify-content: center;
  align-items: center;
`
export const BellIconContainer = styled(Flex)`
  position: relative;
  padding-right: 16px;
  padding-left: 6px;
  cursor: pointer;
  justify-content: center;
  align-items: center;

  svg {
    color: ${({ theme }) => theme.colors.textSubtle};
    width: 30px;
  }

  .notification-badge {
    position: absolute;
    bottom: 45%;
    left: 40%;
    width: 21px;
    font-size: 16px;
    height: 21px;
    border: 2px solid ${({ theme }) => theme.colors.backgroundAlt};
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.success};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }
`

export const Dot = styled('span').withConfig({
  shouldForwardProp: (props) => !['show'].includes(props),
})<{
  show: boolean
  color: keyof Colors
}>`
  display: ${({ show }) => (show ? 'inline-flex' : 'none')};
  width: 8px;
  height: 8px;
  pointer-events: none;
  border-radius: 50%;
  background-color: ${({ theme, color }) => theme.colors[color]};
`
