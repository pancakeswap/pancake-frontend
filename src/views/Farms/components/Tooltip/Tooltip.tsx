import React from 'react'
import styled from 'styled-components'

export interface TooltipProps {
  content: React.ReactNode
}

const TooltipContent = styled.div`
  background: #27262c;
  padding: 16px;
  border-radius: 16px;
  color: #eae2fc;
  width: max-content;
  display: none;
  box-shadow: 0px 4px 12px -8px rgba(14, 14, 44, 0.1);
  padding: 16px;
  max-height: 500px;
  z-index: 5;
  position: absolute;
  bottom: calc(100% + 16px);
  transform: translate(34px, 0);
  right: 0;
  max-width: 246px;

  &:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #27262c;
    bottom: 0;
    position: absolute;
    transform: translate(-34px, 9px);
    right: 0;
  }
`

const Container = styled.div`
  position: relative;

  &:hover ${TooltipContent}, &:focus-within ${TooltipContent} {
    display: block;
  }
`

const Tooltip: React.FunctionComponent<TooltipProps> = ({ content, children }) => {
  return (
    <Container>
      {children}
      <TooltipContent>{content}</TooltipContent>
    </Container>
  )
}

export default Tooltip
