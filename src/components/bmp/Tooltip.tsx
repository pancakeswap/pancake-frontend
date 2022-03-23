import React from 'react'
import { CloseIcon, Overlay, Box, IconButton } from '@pancakeswap/uikit'
import styled from '@binance/mp-styled'

const OverlayInner = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  position: absolute;
  top: 50%;
  width: 80%;
  border-radius: 10px;
  margin: auto;
  padding: 16px;
  left: 0;
  right: 0;
`
const Tooltip = ({ visible, onClose, children }) => {
  if (visible) {
    return (
      <Overlay onClick={onClose} style={{ backgroundColor: 'transparent' }}>
        <OverlayInner>
          <Box style={{ marginRight: 20 }}>{children}</Box>
          <IconButton
            variant="text"
            style={{ position: 'absolute', top: 0, right: 0 }}
            onClick={onClose}
            aria-label="close the dialog"
          >
            <CloseIcon color="text" width="24px" />
          </IconButton>
        </OverlayInner>
      </Overlay>
    )
  }
  return null
}
export default Tooltip
