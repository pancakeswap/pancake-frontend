import React, { useState } from 'react'
import { Button, InjectedModalProps, Skeleton, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { useGetCollectibles, useProfile } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { fetchProfile } from 'state/profile'
import { getAddressByType } from 'utils/collectibles'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { getErc721Contract } from 'utils/contractHelpers'
import { useProfile as useProfileContract } from 'hooks/useContract'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import SelectionCard from '../SelectionCard'
import ApproveConfirmButtons from '../ApproveConfirmButtons'

type ChangeProfilePicPageProps = InjectedModalProps

const ChangeProfilePicPage: React.FC<ChangeProfilePicPageProps> = ({ onDismiss }) => {
  const [selectedNft, setSelectedNft] = useState({
    tokenId: null,
    nftAddress: null,
  })
  const { t } = useTranslation()
  const { isLoading, tokenIds, nftsInWallet } = useGetCollectibles()
  const dispatch = useAppDispatch()
  const { profile } = useProfile()
  const profileContract = useProfileContract()
  const { account, library } = useWeb3React()
  const { toastSuccess } = useToast()
  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onApprove: () => {
        const contract = getErc721Contract(selectedNft.nftAddress, library.getSigner())
        return contract.approve(getPancakeProfileAddress(), selectedNft.tokenId)
      },
      onConfirm: () => {
        if (!profile.isActive) {
          return profileContract.reactivateProfile(selectedNft.nftAddress, selectedNft.tokenId)
        }

        return profileContract.updateProfile(selectedNft.nftAddress, selectedNft.tokenId)
      },
      onSuccess: async () => {
        // Re-fetch profile
        await dispatch(fetchProfile(account))
        toastSuccess(t('Profile Updated!'))

        onDismiss()
      },
    })

  return (
    <>
      <Text as="p" color="textSubtle" mb="24px">
        {t('Choose a new Collectible to use as your profile pic.')}
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
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving || isConfirming}>
        {t('Close Window')}
      </Button>
    </>
  )
}

export default ChangeProfilePicPage
