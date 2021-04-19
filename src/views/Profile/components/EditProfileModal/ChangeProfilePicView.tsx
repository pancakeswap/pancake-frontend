import React, { useState } from 'react'
import { Button, InjectedModalProps, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetCollectibles, useProfile, useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { fetchProfile } from 'state/profile'
import { getAddressByType } from 'utils/collectibles'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useERC721, useProfile as useProfileContract } from 'hooks/useContract'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import SelectionCard from '../SelectionCard'
import ApproveConfirmButtons from '../ApproveConfirmButtons'

type ChangeProfilePicPageProps = InjectedModalProps

const ChangeProfilePicPage: React.FC<ChangeProfilePicPageProps> = ({ onDismiss }) => {
  const [selectedNft, setSelectedNft] = useState({
    tokenId: null,
    nftAddress: null,
  })
  const TranslateString = useI18n()
  const { isLoading, tokenIds, nftsInWallet } = useGetCollectibles()
  const dispatch = useAppDispatch()
  const { profile } = useProfile()
  const contract = useERC721(selectedNft.nftAddress)
  const profileContract = useProfileContract()
  const { account } = useWeb3React()
  const { toastSuccess } = useToast()
  const {
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    handleApprove,
    handleConfirm,
  } = useApproveConfirmTransaction({
    onApprove: () => {
      return contract.methods.approve(getPancakeProfileAddress(), selectedNft.tokenId).send({ from: account })
    },
    onConfirm: () => {
      if (!profile.isActive) {
        return profileContract.methods
          .reactivateProfile(selectedNft.nftAddress, selectedNft.tokenId)
          .send({ from: account })
      }

      return profileContract.methods.updateProfile(selectedNft.nftAddress, selectedNft.tokenId).send({ from: account })
    },
    onSuccess: async () => {
      // Re-fetch profile
      await dispatch(fetchProfile(account))
      toastSuccess('Profile Updated!')

      onDismiss()
    },
  })

  return (
    <>
      <Text as="p" color="textSubtle" mb="24px">
        {TranslateString(999, 'Choose a new Collectible to use as your profile pic.')}
      </Text>
      {isLoading ? (
        <Skeleton height="80px" mb="16px" />
      ) : (
        nftsInWallet.map((walletNft) => {
          const [firstTokenId] = tokenIds[walletNft.identifier]
          const handleChange = (value: string) => {
            setSelectedNft({
              tokenId: Number(value),
              nftAddress: getAddressByType(walletNft.type),
            })
          }

          return (
            <SelectionCard
              name="profilePicture"
              key={walletNft.identifier}
              value={firstTokenId}
              image={`/images/nfts/${walletNft.images.md}`}
              isChecked={firstTokenId === selectedNft.tokenId}
              onChange={handleChange}
              disabled={isApproving || isConfirming || isConfirmed}
            >
              <Text bold>{walletNft.name}</Text>
            </SelectionCard>
          )
        })
      )}
      {!isLoading && nftsInWallet.length === 0 && (
        <>
          <Text as="p" color="textSubtle" mb="16px">
            {TranslateString(999, 'Sorry! You don’t have any eligible Collectibles in your wallet to use!')}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {TranslateString(999, 'Make sure you have a Pancake Collectible in your wallet and try again!')}
          </Text>
        </>
      )}
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || isApproved || selectedNft.tokenId === null}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed || selectedNft.tokenId === null}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving || isConfirming}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </>
  )
}

export default ChangeProfilePicPage
