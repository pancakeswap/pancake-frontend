import React, { useState } from 'react'
import { Button, InjectedModalProps, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useProfile } from 'state/profile/hooks'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { fetchProfile } from 'state/profile'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { getErc721Contract } from 'utils/contractHelpers'
import { useProfile as useProfileContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { ToastDescriptionWithTx } from 'components/Toast'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import SelectionCard from 'views/ProfileCreation/SelectionCard'
import { useUserNfts } from 'state/nftMarket/hooks'
import { NftLocation } from 'state/nftMarket/types'

type ChangeProfilePicPageProps = InjectedModalProps

const ChangeProfilePicPage: React.FC<ChangeProfilePicPageProps> = ({ onDismiss }) => {
  const [selectedNft, setSelectedNft] = useState({
    tokenId: null,
    nftAddress: null,
  })
  const { t } = useTranslation()
  const { nfts } = useUserNfts()
  const dispatch = useAppDispatch()
  const { profile } = useProfile()
  const profileContract = useProfileContract()
  const { account, library } = useWeb3React()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const nftsInWallet = nfts.filter((nft) => nft.tokens[nft.tokenId].nftLocation === NftLocation.WALLET)

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onApprove: () => {
        const contract = getErc721Contract(selectedNft.nftAddress, library.getSigner())
        return callWithGasPrice(contract, 'approve', [getPancakeProfileAddress(), selectedNft.tokenId])
      },
      onConfirm: () => {
        if (!profile.isActive) {
          return callWithGasPrice(profileContract, 'reactivateProfile', [selectedNft.nftAddress, selectedNft.tokenId])
        }

        return callWithGasPrice(profileContract, 'updateProfile', [selectedNft.nftAddress, selectedNft.tokenId])
      },
      onSuccess: async ({ receipt }) => {
        // Re-fetch profile
        await dispatch(fetchProfile(account))
        toastSuccess(t('Profile Updated!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)

        onDismiss()
      },
    })

  return (
    <>
      <Text as="p" color="textSubtle" mb="24px">
        {t('Choose a new Collectible to use as your profile pic.')}
      </Text>
      {nftsInWallet.map((walletNft) => {
        const handleChange = (tokenId: string) => {
          setSelectedNft({
            tokenId,
            nftAddress: walletNft.collectionAddress,
          })
        }

        return (
          <SelectionCard
            name="profilePicture"
            key={walletNft.tokenId}
            value={selectedNft.tokenId}
            image={walletNft.image.thumbnail}
            isChecked={walletNft.tokenId === selectedNft.tokenId}
            onChange={() => handleChange(walletNft.tokenId)}
            disabled={isApproving || isConfirming || isConfirmed}
          >
            <Text bold>{walletNft.name}</Text>
          </SelectionCard>
        )
      })}
      {nfts.length === 0 && (
        <>
          <Text as="p" color="textSubtle" mb="16px">
            {t('Sorry! You don’t have any eligible Collectibles in your wallet to use!')}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {t('Make sure you have a Pancake Collectible in your wallet and try again!')}
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
      <Button mt="8px" variant="text" width="100%" onClick={onDismiss} disabled={isApproving || isConfirming}>
        {t('Close Window')}
      </Button>
    </>
  )
}

export default ChangeProfilePicPage
