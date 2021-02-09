import React, { useState } from 'react'
import { Button, InjectedModalProps, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useDispatch } from 'react-redux'
import nftList from 'config/constants/nfts'
import { useProfile, useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { fetchProfile } from 'state/profile'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { usePancakeRabbits, useProfile as useProfileContract } from 'hooks/useContract'
import { getPancakeProfileAddress, getPancakeRabbitsAddress } from 'utils/addressHelpers'
import SelectionCard from '../SelectionCard'
import ApproveConfirmButtons from '../ApproveConfirmButtons'

type ChangeProfilePicPageProps = InjectedModalProps

const ChangeProfilePicPage: React.FC<ChangeProfilePicPageProps> = ({ onDismiss }) => {
  const [tokenId, setTokenId] = useState(null)
  const TranslateString = useI18n()
  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts()
  const dispatch = useDispatch()
  const { profile } = useProfile()
  const pancakeRabbitsContract = usePancakeRabbits()
  const profileContract = useProfileContract()
  const { account } = useWallet()
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
      return pancakeRabbitsContract.methods.approve(getPancakeProfileAddress(), tokenId).send({ from: account })
    },
    onConfirm: () => {
      if (!profile.isActive) {
        return profileContract.methods.reactivateProfile(getPancakeRabbitsAddress(), tokenId).send({ from: account })
      }

      return profileContract.methods.updateProfile(getPancakeRabbitsAddress(), tokenId).send({ from: account })
    },
    onSuccess: async () => {
      // Re-fetch profile
      await dispatch(fetchProfile(account))
      toastSuccess('Profile Updated!')

      onDismiss()
    },
  })
  const bunnyIds = Object.keys(nftsInWallet).map((nftWalletItem) => Number(nftWalletItem))
  const walletNfts = nftList.filter((nft) => bunnyIds.includes(nft.bunnyId))

  return (
    <>
      <Text as="p" color="textSubtle" mb="24px">
        {TranslateString(999, 'Choose a new Collectible to use as your profile pic.')}
      </Text>
      {isLoading ? (
        <Skeleton height="80px" mb="16px" />
      ) : (
        walletNfts.map((walletNft) => {
          const [firstTokenId] = nftsInWallet[walletNft.bunnyId].tokenIds

          return (
            <SelectionCard
              name="profilePicture"
              key={walletNft.bunnyId}
              value={firstTokenId}
              image={`/images/nfts/${walletNft.images.md}`}
              isChecked={firstTokenId === tokenId}
              onChange={(value: string) => setTokenId(parseInt(value, 10))}
              disabled={isApproving || isConfirming || isConfirmed}
            >
              <Text bold>{walletNft.name}</Text>
            </SelectionCard>
          )
        })
      )}
      {!isLoading && walletNfts.length === 0 && (
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
        isApproveDisabled={isConfirmed || isConfirming || isApproved || tokenId === null}
        isApproving={isApproving}
        isConfirmDisabled={!isApproved || isConfirmed || tokenId === null}
        isConfirming={isConfirming}
        onApprove={handleApprove}
        onConfirm={handleConfirm}
      />
      <Button variant="text" fullWidth onClick={onDismiss} disabled={isApproving || isConfirming}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </>
  )
}

export default ChangeProfilePicPage
