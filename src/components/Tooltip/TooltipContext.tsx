import React, { createContext, useState } from 'react'
import styled from 'styled-components'

interface TooltipContext {
  onPresent: (node: React.ReactNode, key?: string) => void
  onDismiss: () => void
}

const TooltipWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndices.modal - 1};
  pointer-events: none;
`

export const Context = createContext<TooltipContext>({
  onPresent: () => null,
  onDismiss: () => null,
})

const TooltipProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tooltipNode, setTooltipNode] = useState<React.ReactNode>()

  const handlePresent = (node: React.ReactNode) => {
    setTooltipNode(node)
    setIsOpen(true)
  }

  const handleDismiss = () => {
    setTooltipNode(undefined)
    setIsOpen(false)
  }

  return (
    <Context.Provider
      value={{
        onPresent: handlePresent,
        onDismiss: handleDismiss,
      }}
    >
      {isOpen && React.isValidElement(tooltipNode) && React.cloneElement(tooltipNode)}
      {children}
    </Context.Provider>
  )
}

export default TooltipProvider
