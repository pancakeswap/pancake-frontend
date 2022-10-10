import { useMemo } from 'react'
import { Modal, ModalBody, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'
import { useFarmHarvestTransaction } from 'state/global/hooks'
import { useAllTransactions } from 'state/transactions/hooks'
import { FarmTransactionStatus, NonBscFarmStepType } from 'state/transactions/actions'
import FarmInfo from './FarmInfo'
import FarmDetail from './FarmDetail'

interface FarmTransactionModalProps {
  onDismiss: () => void
}

const FarmTransactionModal: React.FC<React.PropsWithChildren<FarmTransactionModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const allTransactions = useAllTransactions()
  const { pickedTx } = useFarmHarvestTransaction()

  const pickedData = useMemo(() => allTransactions?.[pickedTx.chainId]?.[pickedTx.tx], [allTransactions, pickedTx])

  const modalTitle = useMemo(() => {
    let title = ''

    if (pickedData?.nonBscFarm) {
      const { type, status } = pickedData?.nonBscFarm
      const isPending = status === FarmTransactionStatus.PENDING
      if (type === NonBscFarmStepType.STAKE) {
        title = isPending ? t('Staking') : t('Staked!')
      } else if (type === NonBscFarmStepType.UNSTAKE) {
        title = isPending ? t('Unstaking') : t('Unstaked!')
      }
    }
    return title
  }, [pickedData, t])

  return (
    <Modal title={modalTitle} onDismiss={onDismiss}>
      <ModalBody width={['100%', '100%', '100%', '352px']}>
        <Flex flexDirection="column">
          <FarmInfo pickedData={pickedData} />
          <LightGreyCard padding="16px 16px 0 16px">
            {pickedData?.nonBscFarm?.steps.map((step) => (
              <FarmDetail key={step.step} step={step} status={pickedData?.nonBscFarm?.status} />
            ))}
          </LightGreyCard>
        </Flex>
      </ModalBody>
    </Modal>
  )
}

export default FarmTransactionModal
