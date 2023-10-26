import { Flex, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import styled, { keyframes, css } from 'styled-components'

// Notification View styles
export const Menu = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme }) => theme.card.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 24px;
  padding-bottom: 4px;
  pointer-events: auto;
  width: 400px;
  overflow: hidden;
  position: relative;
  visibility: visible;
  z-index: 1001;

  ${({ isOpen }) =>
    !isOpen &&
    `
    pointer-events: none;
    visibility: hidden;
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

export const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

export const FilterContainer = styled.div`
  display: flex;
  juxtify-content: space-between;
  align-items: center;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
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
export const ViewContainer = styled.div<{ viewIndex: number }>`
  display: flex;
  width: 300%;
  transition: transform 300ms ease-in-out;
  transform: translateX(${({ viewIndex }) => (viewIndex === 0 ? '0%' : viewIndex === 1 ? '-33.33%' : '-66.66%')});
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
  animation: ${() => openLeft} 0.65s;
`

export const NotificationsWrapper = styled.div<{ isClosing: boolean }>`
  animation-fill-mode: forwards;
  position: relative;
  ${({ isClosing }) =>
    isClosing &&
    css`
      animation: ${() => closeRight} 0.65s;
    `}
`

export const NotificationContainerStyled = styled.div`
  max-height: 375px;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  &:hover {
    cursor: pointer;
  }
`

export const StyledNotificationWrapper = styled.div`
  animation-fill-mode: forwards;
  border-radius: 10px;
  display: flex;
  padding: 5px 10px 5px 10px;
  position: relative;
  overflow: hidden;

  animation: ${() => openRight} 0.65s;
`

export const ContentsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border: 1.2px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.3s;
  background-color: transparent;
  width: 100%;

  &:hover {
    transform: scale(1.01);
    background-color: ${({ theme }) => (theme.isDark ? '#372F46' : '#EDEAF4')};
  }

  transition: background-color 0.15s ease;
`

export const Description = styled.div<{ show: boolean; elementHeight: number }>`
  margin-bottom: 5px 0;
  overflow: hidden;
  max-width: 100%;
  word-break: break-word;
  transition: max-height 0.33s ease-in-out;
  max-height: ${({ show, elementHeight }) => (show ? `${elementHeight}px` : '32px')};
`

export const ExpandButton = styled(Text)`
  &:hover {
    cursor: pointer;
  }
`

export const StyledLink = styled(Link)<{ hidden: boolean }>`
  max-height: 35px;
  height: 35px;
  width: 100%;
  border: ${({ theme }) => `2px solid ${theme.colors.primary}`};
  border-radius: 12px;
  color: ${({ theme }) => `${theme.colors.primary}`};
  font-weight: bold;
  display: ${({ hidden }) => `${hidden ? 'flex' : 'none'}`};
  margin-top: 17px;
  margin-bottom: 6px;
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
    bottom: 60%;
    left: 45%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: red;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }
`
