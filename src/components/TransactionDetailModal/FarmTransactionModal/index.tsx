import { useMemo } from 'react'
import { Modal, ModalBody, Flex } from '@pancakeswap/uikit'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'
import { useFarmHarvestTransaction } from 'state/global/hooks'
import { useAllTransactions } from 'state/transactions/hooks'
import FarmInfo from './FarmInfo'
import FarmDetail from './FarmDetail'

interface FarmTransactionModalProps {
  onDismiss: () => void
}

const FarmTransactionModal: React.FC<React.PropsWithChildren<FarmTransactionModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const allTransactions = useAllTransactions()
  const { pickedTx } = useFarmHarvestTransaction()
  // const { account } = useActiveWeb3React()

  const pickedData = useMemo(() => allTransactions[pickedTx], [allTransactions, pickedTx])

  return (
    <Modal title="Staking" onDismiss={onDismiss}>
      <ModalBody width={['100%', '100%', '100%', '352px']}>
        <Flex flexDirection="column">
          <FarmInfo pickedData={pickedData} />
          <LightGreyCard padding="16px 16px 0 16px">
            <FarmDetail chainId={56} />
          </LightGreyCard>
        </Flex>
      </ModalBody>
    </Modal>
  )
}

export default FarmTransactionModal
