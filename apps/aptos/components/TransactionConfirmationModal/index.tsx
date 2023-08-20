// TODO: aptos merge
import { ChainId, Currency } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import {
  AptosIcon,
  ArrowUpIcon,
  AutoColumn,
  Button,
  ColumnCenter,
  ConfirmationPendingContent,
  InjectedModalProps,
  Modal,
  ModalProps,
  ScanLink,
  Text,
} from '@pancakeswap/uikit'
import { useCallback } from 'react'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { useActiveChainId } from 'hooks/useNetwork'

const Wrapper = styled.div`
  width: 100%;
`
const Section = styled(AutoColumn)`
  padding: 24px;
`

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 24px 0;
`

export function TransactionSubmittedContent({
  onDismiss,
  chainId,
  hash,
}: {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
}) {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Section>
        <ConfirmedIcon>
          <ArrowUpIcon strokeWidth={0.5} width="90px" color="primary" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <Text fontSize="20px">{t('Transaction Submitted')}</Text>
          {chainId && hash && (
            <ScanLink small icon={<AptosIcon />} href={getBlockExploreLink(hash, 'transaction', chainId)}>
              {t('View on %site%', {
                site: t('Explorer'),
              })}
            </ScanLink>
          )}
          <Button onClick={onDismiss} mt="20px">
            {t('Close')}
          </Button>
        </AutoColumn>
      </Section>
    </Wrapper>
  )
}

interface ConfirmationModalProps {
  title: string
  customOnDismiss?: () => void
  hash: string | undefined
  content: () => React.ReactNode
  attemptingTxn: boolean
  pendingText: string
  currencyToAdd?: Currency | undefined
}

const TransactionConfirmationModal: React.FC<
  React.PropsWithChildren<InjectedModalProps & ConfirmationModalProps & ModalProps>
> = ({ title, onDismiss, customOnDismiss, attemptingTxn, hash, pendingText, content, ...props }) => {
  const chainId = useActiveChainId()

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  if (!chainId) return null

  return (
    <Modal title={title} headerBackground="gradientCardHeader" {...props} onDismiss={handleDismiss}>
      {attemptingTxn ? (
        <ConfirmationPendingContent pendingText={pendingText} />
      ) : hash ? (
        <TransactionSubmittedContent chainId={chainId} hash={hash} onDismiss={handleDismiss} />
      ) : (
        content()
      )}
    </Modal>
  )
}

export default TransactionConfirmationModal
