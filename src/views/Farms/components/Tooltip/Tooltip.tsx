import React from 'react'
import styled, { css } from 'styled-components'

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  content: React.ReactNode
  position?: TooltipPosition
  offset?: string
}

const getPosition = (position: TooltipPosition, offset: string, isMobile = false) => {
  switch (position) {
    case 'top':
      return css`
        bottom: calc(100% + ${offset});
        ${isMobile ? 'left: -12px;' : 'left: 50%; transform: translateX(-50%);'}
      `
    case 'right':
      return css`
        left: calc(100% + ${offset});
        top: 50%;
        transform: translateY(-50%);
      `
    case 'left':
      return css`
        right: calc(100% + ${offset});
        top: 50%;
        transform: translateY(-50%);
      `
    default:
      return css`
        ${isMobile ? 'left: -12px;' : 'left: 50%; transform: translateX(-50%);'}
        top: calc(100% + ${offset});
      `
  }
}

const getTriangleStyles = (position: TooltipPosition, offset: string, color: string, isMobile = false) => {
  switch (position) {
    case 'top':
      return css`
        bottom: 0;
        left: ${isMobile ? '20px' : '50%'};
        transform: ${isMobile ? 'translate(0, 100%)' : 'translate(-50%, 100%)'};
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid ${color};
      `
    case 'right':
      return css`
        left: 0;
        top: 50%;
        transform: translate(-100%, -50%);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid ${color};
      `
    case 'left':
      return css`
        right: 0;
        top: 50%;
        transform: translate(100%, -50%);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid ${color};
      `
    default:
      return css`
        top: 0;
        left: ${isMobile ? '20px' : '50%'};
        transform: ${isMobile ? 'translate(0, -100%)' : 'translate(-50%, -100%)'};
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid ${color};
      `
  }
}

const TooltipContent = styled.div<{ position: TooltipPosition; offset: string }>`
  background: ${({ theme }) => theme.tooltip.background};
  padding: 16px;
  border-radius: 16px;
  color: ${({ theme }) => theme.tooltip.text};
  width: max-content;
  display: block;
  padding: 16px;
  max-height: 500px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  position: absolute;
  max-width: 246px;
  word-wrap: break-word;

  ${({ position, offset }) => getPosition(position, offset, true)};

  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ position, offset }) => getPosition(position, offset)};
  }

  &:after {
    content: '';
    display: block;
    width: 0;
    height: 0;

    position: absolute;

    ${({ position, offset, theme }) => getTriangleStyles(position, offset, theme.tooltip.background, true)};

    ${({ theme }) => theme.mediaQueries.sm} {
      ${({ position, offset, theme }) => getTriangleStyles(position, offset, theme.tooltip.background)};
    }
  }
`

const Container = styled.div`
  position: relative;

  &:hover ${TooltipContent}, &:focus-within ${TooltipContent} {
    display: block;
  }
`

const Tooltip: React.FunctionComponent<TooltipProps> = ({ content, children, position = 'top', offset = '12px' }) => {
  return (
    <Container>
      {children}
      <TooltipContent position={position} offset={offset}>
        {content}
      </TooltipContent>
    </Container>
  )
}

export default Tooltip
