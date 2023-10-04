import styled, { keyframes, css } from 'styled-components'
import { Box, CheckmarkIcon, Flex, Text } from '@pancakeswap/uikit'
import Link from 'next/link'

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
export const ViewContainer = styled.div<{ isRightView: boolean }>`
  display: flex;
  width: 200%;
  transition: transform 300ms ease-in-out;
  transform: translateX(${({ isRightView }) => (isRightView ? '0%' : '-50%')});
`

export const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
  justify-content: center;
`

export const opneRight = keyframes` 
    0% {
        right: -150%;
    }
    100% {
        right: 0%;
    }
`
export const openLeft = keyframes` 
    0% {
        right: 0%;
    }
    100% {
        right: -150%;
    }
`

export const NotificationContainerStyled = styled.div`
  max-height: 360px;
  overflow-x: hidden;
  &:hover {
    cursor: pointer;
  }
`

export const StyledNotificationWrapper = styled.div<{ isclosing: boolean }>`
  animation-fill-mode: forwards;
  width: 100%;
  border-radius: 10px;
  display: flex;
  padding: 8px 15px;
  position: relative;
  overflow: hidden;

  animation: ${({ isclosing }) => (!isclosing ? opneRight : openLeft)} 0.65s;
`

export const ContentsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 18px;
  overflow: hidden;
  transition: transform 0.3s;
  background-color: ${({ theme }) => (theme.isDark ? '#372F46' : '#EDEAF4')};

  &:hover {
    transform: scale(1.01);
    background-color: transparent;
  }

  ${({ theme }) =>
    theme.isDark &&
    css`
      background-color: #372f46;
    `}

  transition: background-color 0.15s ease;
`

export const Description = styled.div<{ show: boolean; elementHeight: number }>`
  margin-bottom: 5px 0;
  overflow: hidden;
  max-width: 100%;
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
  margin-top: 12px;
  margin-bottom: 6px;
  justify-content: center;
  align-items: center;
`
export const BellIconContainer = styled(Box)`
  position: relative;
  padding-right: 16px;
  padding-left: 8px;
  cursor: pointer;

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

// Progress bar styles
export const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
`

export const StepContainer = styled.div<{ index: number; stepLength: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.index !== props.stepLength - 1 &&
    `
      width: 100%;
    `}
`

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: green;
`

export const StepIcon = styled.div<{ pendingStep: boolean; nextStep: boolean; index: number }>`
  border-radius: 50%;
  background: ${({ pendingStep }) => (!pendingStep ? '#EDEAF4' : '#1DC7D3')};
  border: 2px solid #7a6daa;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.nextStep &&
    css`
      animation: ${blinkAnimation} 1.5s infinite;
    `}
`

export const Divider = styled.div<{ completedStep: boolean }>`
  flex-grow: 1;
  border-top: ${({ completedStep }) => (completedStep ? '2px dashed #1DC7D3' : '2px dashed #7A6DAA')};
  margin-right: 4px;
`

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
`
export const StyledCheckIcon = styled(CheckmarkIcon)<{ index: number; stepLength: number }>`
  position: absolute;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #32d0aa;
  top: -12%;
  right: ${({ index, stepLength }) => (index !== stepLength - 1 ? '75%' : '-5%')};
`
