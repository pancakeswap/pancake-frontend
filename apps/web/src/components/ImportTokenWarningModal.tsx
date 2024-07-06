import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { Box, InjectedModalProps, Modal } from '@pancakeswap/uikit'
import ImportToken from 'components/SearchModal/ImportToken'
import { useUnsupportedTokens } from 'hooks/Tokens'
import { useCallback, useMemo } from 'react'
import { UnsupportedModal } from './UnsupportedModal'

interface Props extends InjectedModalProps {
  tokens: Token[]
  onCancel: () => void
}

const ImportTokenWarningModal: React.FC<React.PropsWithChildren<Props>> = ({ tokens, onDismiss, onCancel }) => {
  const { t } = useTranslation()

  const unsupportedTokens = useUnsupportedTokens()

  const hasUnsupportedTokens = useMemo(() => {
    return tokens.some((token) => {
      return unsupportedTokens?.[token.address]
    })
  }, [tokens, unsupportedTokens])

  const handleOnDismiss = useCallback(() => {
    onDismiss?.()
    onCancel()
  }, [onDismiss, onCancel])

  if (hasUnsupportedTokens) {
    return <UnsupportedModal onDismiss={onCancel} currencies={tokens} />
  }

  return (
    <Modal title={t('Import Token')} onDismiss={handleOnDismiss}>
      <Box maxWidth="380px">
        <ImportToken tokens={tokens} handleCurrencySelect={onDismiss} />
      </Box>
    </Modal>
  )
}

export default ImportTokenWarningModal
