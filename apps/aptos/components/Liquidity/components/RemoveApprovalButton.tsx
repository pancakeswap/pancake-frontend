import { useTranslation } from '@pancakeswap/localization'
import { Button, Dots } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { ApprovalState } from '../type'

const EnableText = (approval) => {
  const { t } = useTranslation()

  if (approval === ApprovalState.PENDING) return <Dots>{t('Enabling')}</Dots>

  if (approval === ApprovalState.APPROVED) return <>{t('Enabled')}</>

  return <>{t('Enable')}</>
}

const RemoveApprovalButton = ({ children }) => {
  const signatureData = null
  const approval = false

  // Philip TODO: Add signatureData and Approval logic

  return (
    <>
      <Button
        variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
        onClick={_noop}
        disabled={approval !== ApprovalState.NOT_APPROVED}
        width="100%"
        mr="0.5rem"
      >
        <EnableText approval={approval} />
      </Button>

      {children({ approval, signatureData })}
    </>
  )
}

export default RemoveApprovalButton
