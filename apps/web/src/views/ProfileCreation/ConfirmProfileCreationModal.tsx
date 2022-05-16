import { Modal, Flex, Text } from '@pancakeswap/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'
import { useTranslation } from 'contexts/Localization'
import { useCake, useProfileContract } from 'hooks/useContract'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useProfile } from 'state/profile/hooks'
import useToast from 'hooks/useToast'
import { requiresApproval } from 'utils/requiresApproval'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { REGISTER_COST } from './config'
import { State } from './contexts/types'

interface Props {
  userName: string
  selectedNft: State['selectedNft']
  account: string
  teamId: number
  minimumCakeRequired: BigNumber
  allowance: BigNumber
  onDismiss?: () => void
}

const ConfirmProfileCreationModal: React.FC<Props> = ({
  account,
  teamId,
  selectedNft,
  minimumCakeRequired,
  allowance,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const profileContract = useProfileContract()
  const { refresh: refreshProfile } = useProfile()
  const { toastSuccess } = useToast()
  const { reader: cakeContractReader, signer: cakeContractApprover } = useCake()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        return requiresApproval(cakeContractReader, account, profileContract.address, minimumCakeRequired)
      },
      onApprove: () => {
        return callWithGasPrice(cakeContractApprover, 'approve', [profileContract.address, allowance.toJSON()])
      },
      onConfirm: () => {
        return callWithGasPrice(profileContract, 'createProfile', [
          teamId,
          selectedNft.collectionAddress,
          selectedNft.tokenId,
        ])
      },
      onSuccess: async ({ receipt }) => {
        refreshProfile()
        onDismiss()
        toastSuccess(t('Profile created!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  return (
    <Modal title={t('Complete Profile')} onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {t('Submitting NFT to contract and confirming User Name and Team.')}
      </Text>
      <Flex justifyContent="space-between" mb="16px">
        <Text>{t('Cost')}</Text>
        <Text>{t('%num% CAKE', { num: formatUnits(REGISTER_COST) })}</Text>
      </Flex>
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
    </Modal>
  )
}

export default ConfirmProfileCreationModal
