import { ArrowDownIcon, ArrowUpDownIcon, Box, ButtonProps, IconButton, RefreshIcon } from '@pancakeswap/uikit'

import { memo, useCallback } from 'react'

import { useBuyCryptoActionHandlers } from 'state/buyCrypto/hooks'
import styled from 'styled-components'

const SwitchIconButton = styled(IconButton)`
  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const SwitchButton = (props: ButtonProps) => (
  <SwitchIconButton variant="light" scale="sm" {...props}>
    <ArrowDownIcon className="icon-down" color="primary" />
    <ArrowUpDownIcon className="icon-up-down" color="primary" />
  </SwitchIconButton>
)
export const OnRampFlipButton = memo(function FlipButton() {
  const { onSwitchTokens } = useBuyCryptoActionHandlers()

  const onFlip = useCallback(() => {
    onSwitchTokens()
  }, [onSwitchTokens])

  return (
    <Box p="24px" mb="18px">
      <RefreshIcon width="24px" height="24px" color="primary" onClick={onFlip} />
    </Box>
  )
})
