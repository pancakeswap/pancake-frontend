import { HtmlProps } from 'next/dist/shared/lib/html-context.shared-runtime'
import { ReactNode } from 'react'
import { FilterdNetworkWrapper, NetworkFilterOverlay } from 'views/BuyCrypto/styles'

interface PopOverScreenProps {
  onClick: () => void
  showPopover: boolean
  children: ReactNode
  props?: HtmlProps
}

export const PopOverScreenContainer = ({ onClick, showPopover, children, ...props }: PopOverScreenProps) => {
  return (
    <>
      <NetworkFilterOverlay showPopOver={showPopover} onClick={onClick} />
      <FilterdNetworkWrapper showPopOver={showPopover} {...props}>
        {children}
      </FilterdNetworkWrapper>
    </>
  )
}
