import React from 'react'
import styled from 'styled-components'
import {
  ChevronRightIcon,
  Button as UIKitButton,
  AutoRenewIcon,
  ChevronDownIcon,
  Box,
  Flex,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'

interface ApproveConfirmButtonsProps {
  isApproveDisabled: boolean
  isApproving: boolean
  isConfirming: boolean
  isConfirmDisabled: boolean
  onApprove: () => void
  onConfirm: () => void
}

const StyledApprovConfirmButtons = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 24px 1fr;
  }
`

const Button = styled(UIKitButton)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 160px;
  }
`

const iconAttrs = { width: '24px', color: 'textDisabled' }

const ChevronRight = styled(ChevronRightIcon).attrs(iconAttrs)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const ChevronBottom = styled(ChevronDownIcon).attrs(iconAttrs)`
  display: block;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

const ApproveConfirmButtons: React.FC<ApproveConfirmButtonsProps> = ({
  isApproveDisabled,
  isApproving,
  isConfirming,
  isConfirmDisabled,
  onApprove,
  onConfirm,
}) => {
  const TranslateString = useI18n()

  return (
    <StyledApprovConfirmButtons>
      <Box>
        <Button
          disabled={isApproveDisabled}
          onClick={onApprove}
          endIcon={isApproving ? spinnerIcon : undefined}
          isLoading={isApproving}
        >
          {isApproving ? TranslateString(800, 'Approving') : TranslateString(564, 'Approve')}
        </Button>
      </Box>
      <Flex justifyContent="center">
        <ChevronRight />
        <ChevronBottom />
      </Flex>
      <Box>
        <Button
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          isLoading={isConfirming}
          endIcon={isConfirming ? spinnerIcon : undefined}
        >
          {isConfirming ? TranslateString(802, 'Confirming') : TranslateString(464, 'Confirm')}
        </Button>
      </Box>
    </StyledApprovConfirmButtons>
  )
}

export default ApproveConfirmButtons
