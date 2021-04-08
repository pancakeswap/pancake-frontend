import React, { useState, useEffect, useRef, RefObject } from 'react'
import styled, { css } from 'styled-components'
import useTooltip from './useTooltip'

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  content: React.ReactNode
  position?: TooltipPosition
  offset?: number
  className?: string
}

const getPosition = (
  position: TooltipPosition,
  offset: number,
  origin: { top: number; left: number; height: number },
  isMobile = false,
) => {
  switch (position) {
    case 'top':
      return css`
        top: ${origin.top - offset}px;
        left: ${origin.left}px;
        transform: translateY(-100%);
      `
    case 'right':
      return css`
        left: ${origin.left + offset + 5}px; // Consider triangle height
        top: ${origin.top - 5}px;
        transform: translateX(100%);
      `
    case 'left':
      return css`
        left: ${origin.left - offset - 5}px; // Consider triangle height
        top: ${origin.top - 5}px;
        transform: translateX(-100%);
      `
    default:
      return css`
        top: ${origin.top + offset + origin.height}px;
        left: ${origin.left}px;
      `
  }
}

const getTriangleStyles = (position: TooltipPosition, offset: number, color: string, isMobile = false) => {
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

const TooltipContent = styled.div<{
  position: TooltipPosition
  offset: number
  origin: {
    top: number
    left: number
    height: number
  }
}>`
  background: ${({ theme }) => theme.tooltip.background};
  border: 1px solid ${({ theme }) => theme.tooltip.background};
  padding: 16px;
  border-radius: 16px;
  color: ${({ theme }) => theme.tooltip.text};
  width: max-content;
  display: block;
  max-height: 500px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  position: absolute;
  max-width: 246px;
  word-wrap: break-word;

  ${({ position, offset, origin }) => getPosition(position, offset, origin, true)};

  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ position, offset, origin }) => getPosition(position, offset, origin)};
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
`

const Tooltip: React.FunctionComponent<TooltipProps> = ({
  content,
  children,
  className,
  position = 'top',
  offset = 12,
}) => {
  const containerRef = useRef(null)
  const [origin, setOrigin] = useState({
    left: 0,
    top: 0,
    height: 0,
  })

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  const [onPresent, onDismiss] = useTooltip(
    <TooltipContent
      position={position}
      offset={offset}
      className={className}
      origin={{
        top: origin.top + scrollTop,
        left: origin.left + scrollLeft,
        height: origin.height,
      }}
    >
      {content}
    </TooltipContent>,
  )

  useEffect(() => {
    if (containerRef) {
      const topOffset = containerRef.current.getBoundingClientRect().top
      const leftOffset = containerRef.current.getBoundingClientRect().left
      setOrigin({ top: topOffset, left: leftOffset, height: containerRef.current.clientHeight })
    }
  }, [])

  return (
    <Container onMouseEnter={onPresent} ref={containerRef}>
      {children}
    </Container>
  )
}

export default Tooltip
