import styled from 'styled-components'
import { ChevronRightIcon, Button as UIKitButton, AutoRenewIcon, ChevronDownIcon, Box, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

export enum ButtonArrangement {
  ROW = 'row',
  SEQUENTIAL = 'sequential',
}

interface ApproveConfirmButtonsProps {
  isApproveDisabled: boolean
  isApproving: boolean
  isConfirming: boolean
  isConfirmDisabled: boolean
  onApprove: () => void
  onConfirm: () => void
  buttonArrangement?: ButtonArrangement
  confirmLabel?: string
  confirmId?: string
  useMinWidth?: boolean
}

const StyledApproveConfirmButtonRow = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 1fr 24px 1fr;
  }
`

const Button = styled(UIKitButton)<{ useMinWidth: boolean }>`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ useMinWidth }) =>
      useMinWidth &&
      `  
    min-width: 160px;
  `}
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

const ApproveConfirmButtons: React.FC<React.PropsWithChildren<ApproveConfirmButtonsProps>> = ({
  isApproveDisabled,
  isApproving,
  isConfirming,
  isConfirmDisabled,
  onApprove,
  onConfirm,
  buttonArrangement = ButtonArrangement.ROW,
  confirmLabel,
  confirmId,
  useMinWidth = true,
}) => {
  const { t } = useTranslation()
  const confirmButtonText = confirmLabel ?? t('Confirm')

  const ApproveConfirmRow = () => {
    return (
      <StyledApproveConfirmButtonRow>
        <Box>
          <Button
            disabled={isApproveDisabled}
            onClick={onApprove}
            endIcon={isApproving ? spinnerIcon : undefined}
            isLoading={isApproving}
            useMinWidth={useMinWidth}
          >
            {isApproving ? t('Enabling') : t('Enable')}
          </Button>
        </Box>
        <Flex justifyContent="center">
          <ChevronRight />
          <ChevronBottom />
        </Flex>
        <Box>
          <Button
            id={confirmId}
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            isLoading={isConfirming}
            endIcon={isConfirming ? spinnerIcon : undefined}
            useMinWidth={useMinWidth}
          >
            {isConfirming ? t('Confirming') : confirmButtonText}
          </Button>
        </Box>
      </StyledApproveConfirmButtonRow>
    )
  }

  const ApproveConfirmSequential = () => {
    return (
      <>
        {isApproveDisabled ? (
          <Box>
            <Button
              id={confirmId}
              onClick={onConfirm}
              disabled={isConfirmDisabled}
              isLoading={isConfirming}
              endIcon={isConfirming ? spinnerIcon : undefined}
            >
              {isConfirming ? t('Confirming') : confirmButtonText}
            </Button>
          </Box>
        ) : (
          <Box>
            <Button onClick={onApprove} endIcon={isApproving ? spinnerIcon : undefined} isLoading={isApproving}>
              {isApproving ? t('Enabling') : t('Enable')}
            </Button>
          </Box>
        )}
      </>
    )
  }

  return buttonArrangement === ButtonArrangement.ROW ? ApproveConfirmRow() : ApproveConfirmSequential()
}

export default ApproveConfirmButtons
