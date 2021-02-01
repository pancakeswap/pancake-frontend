import React from 'react'
import { Modal, Flex, Text } from '@pancakeswap-libs/uikit'
import { useDispatch } from 'react-redux'
import useI18n from 'hooks/useI18n'
import { usePancakeRabbits, useProfile } from 'hooks/useContract'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { fetchProfile } from 'state/profile'
import { useToast } from 'state/hooks'
import ApproveConfirmButtons from './ApproveConfirmButtons'

interface Props {
  userName: string
  tokenId: number
  account: string
  teamId: number
  onDismiss?: () => void
}

const ContributeModal: React.FC<Props> = ({ account, teamId, tokenId, onDismiss }) => {
  const TranslateString = useI18n()
  const profileContract = useProfile()
  const pancakeRabbitsContract = usePancakeRabbits()
  const dispatch = useDispatch()
  const { toastSuccess } = useToast()
  const {
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    handleApprove,
    handleConfirm,
  } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const approvedAddress = await pancakeRabbitsContract.methods.getApproved(tokenId).call()
        return approvedAddress.toLowerCase() === profileContract.options.address.toLowerCase()
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return pancakeRabbitsContract.methods.approve(profileContract.options.address, tokenId).send({ from: account })
    },
    onConfirm: () => {
      return profileContract.methods
        .createProfile(teamId, pancakeRabbitsContract.options.address, tokenId)
        .send({ from: account })
    },
    onSuccess: async () => {
      await dispatch(fetchProfile(account))
      onDismiss()
      toastSuccess('Profile created!')
    },
  })

  return (
    <Modal title="Complete Profile" onDismiss={onDismiss}>
      <Text color="textSubtle" mb="8px">
        {TranslateString(999, 'Submitting NFT to contract and confirming User Name and Team.')}
      </Text>
      <Flex justifyContent="space-between" mb="16px">
        <Text>{TranslateString(999, 'Cost')}</Text>
        <Text>{TranslateString(999, '5 CAKE')}</Text>
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

export default ContributeModal
