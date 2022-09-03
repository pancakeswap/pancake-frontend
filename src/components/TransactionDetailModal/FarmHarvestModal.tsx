import { Modal, ModalBody, Flex, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'
import HarvestInfo from './HarvestInfo'
import HarvestDetail from './HarvestDetail'

const LineStyle = styled.div`
  height: 1px;
  width: 100%;
  margin: 16px 0;
  background-color: ${({ theme }) => theme.colors.cardBorder};
`

const TransactionsDetailModal = ({ onDismiss }: { onDismiss: () => void }) => {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const modalTitle = true ? t('Harvest Pending') : t('Harvest Results')

  return (
    <Modal title={modalTitle} onDismiss={onDismiss}>
      <ModalBody maxWidth={['100%', '100%', '100%', '352px']}>
        <Flex flexDirection="column">
          <HarvestInfo />
          <LightGreyCard mb="16px" padding="16px">
            <HarvestDetail chainId={5} />
            <LineStyle />
            <HarvestDetail chainId={56} />
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
