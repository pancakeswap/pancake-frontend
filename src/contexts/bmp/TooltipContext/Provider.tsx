import React from 'react'
import Tooltip from './Tooltip'

const TooltipContext = React.createContext<{
  visible: boolean
  setVisible(visible: boolean): void
  setNode(node: React.ReactChild): void
  node: React.ReactChild
}>(undefined)

export const TooltipProvider = ({ children }) => {
  const [visible, setVisible] = React.useState(false)
  const [node, setNode] = React.useState<React.ReactChild>('')
  return <TooltipContext.Provider value={{ visible, setVisible, setNode, node }}>{children}</TooltipContext.Provider>
}
export const useTooltip = (node: React.ReactChild) => {
  const { setVisible, setNode } = React.useContext(TooltipContext)
  const onPresent = () => {
    setVisible(true)
    setNode(node)
  }
  return { onPresent }
}

export const TooltipListener = () => {
  const { visible, setVisible, node } = React.useContext(TooltipContext)
  return (
    <Tooltip visible={visible} onClose={() => setVisible(false)}>
      {node}
    </Tooltip>
  )
}
