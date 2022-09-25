import { useTranslation } from '@pancakeswap/localization'
import { Button, Dots, RowBetween } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// Remove all
const ApprovalButtons = ({ children, isValid, symbolA, symbolB }) => {
  const { t } = useTranslation()

  const approveACallback = _noop
  const approveBCallback = _noop

  const approvalA = ApprovalState.NOT_APPROVED
  const approvalB = ApprovalState.NOT_APPROVED

  const showFieldAApproval = approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING
  const showFieldBApproval = approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING
  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  return (
    <>
      {/* {shouldShowApprovalGroup && (
        <RowBetween style={{ gap: '8px' }}>
          {showFieldAApproval && (
            <Button onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING} width="100%">
              {approvalA === ApprovalState.PENDING ? (
                <Dots>{t('Enabling %asset%', { asset: symbolA })}</Dots>
              ) : (
                t('Enable %asset%', { asset: symbolA })
              )}
            </Button>
          )}
          {showFieldBApproval && (
            <Button onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING} width="100%">
              {approvalB === ApprovalState.PENDING ? (
                <Dots>{t('Enabling %asset%', { asset: symbolB })}</Dots>
              ) : (
                t('Enable %asset%', { asset: symbolB })
              )}
            </Button>
          )}
        </RowBetween>
      )}
      {children(shouldShowApprovalGroup)} */}
    </>
  )
}

export default ApprovalButtons
