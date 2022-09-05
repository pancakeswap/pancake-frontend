import { Modal, ModalBody, Flex, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'
import { HarvestStatusType } from 'state/transactions/actions'
import { TransactionDetails } from 'state/transactions/reducer'
import HarvestInfo from './HarvestInfo'
import HarvestDetail from './HarvestDetail'

const LineStyle = styled.div`
  height: 1px;
  width: 100%;
  margin: 16px 0;
  background-color: ${({ theme }) => theme.colors.cardBorder};
`

interface TransactionsDetailModalProps {
  pickedData: TransactionDetails
  onDismiss: () => void
}

const TransactionsDetailModal: React.FC<React.PropsWithChildren<TransactionsDetailModalProps>> = ({
  pickedData,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { sourceChain, destinationChain } = pickedData.farmHarvest
  const isSourceChainSuccess = sourceChain.status === HarvestStatusType.SUCCESS
  const isDestinationChainPending = destinationChain.status === HarvestStatusType.PENDING
  const modalTitle = isDestinationChainPending ? t('Harvest Pending') : t('Harvest Results')

  return (
    <Modal title={modalTitle} onDismiss={onDismiss}>
      <ModalBody maxWidth={['100%', '100%', '100%', '352px']}>
        <Flex flexDirection="column">
          <HarvestInfo pickedData={pickedData} />
          <LightGreyCard mb="16px" padding="16px">
            <HarvestDetail
              account={account}
              tx={sourceChain.tx}
              chainId={sourceChain.chainId}
              isLoading={!isSourceChainSuccess}
            />
            {isSourceChainSuccess && (
              <>
                <LineStyle />
                <HarvestDetail
                  account={account}
                  tx={destinationChain.tx}
                  nonce={sourceChain.nonce}
                  chainId={destinationChain.chainId}
                  sourceChainChainId={sourceChain.chainId}
                  sourceChainTx={sourceChain.tx}
                  isLoading={isDestinationChainPending}
                  isFail={destinationChain.status === HarvestStatusType.FAIL}
                />
              </>
            )}
          </LightGreyCard>
          <Button variant="secondary" onClick={onDismiss}>
            {t('Done')}
          </Button>
        </Flex>
      </ModalBody>
    </Modal>
  )
}

export default TransactionsDetailModal
