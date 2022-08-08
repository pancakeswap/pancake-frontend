import { useState, useMemo } from 'react'
import { Button, Box, InjectedModalProps, Text, Skeleton } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/profile/hooks'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { getErc721Contract } from 'utils/contractHelpers'
import { useProfileContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { ToastDescriptionWithTx } from 'components/Toast'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import SelectionCard from 'views/ProfileCreation/SelectionCard'
import { useApprovalNfts } from 'state/nftMarket/hooks'
import { NftLocation } from 'state/nftMarket/types'
import { useNftsForAddress } from '../../../Nft/market/hooks/useNftsForAddress'

interface ChangeProfilePicPageProps extends InjectedModalProps {
  onSuccess?: () => void
}

const ChangeProfilePicPage: React.FC<ChangeProfilePicPageProps> = ({ onDismiss, onSuccess }) => {
  const [selectedNft, setSelectedNft] = useState({
    tokenId: null,
    collectionAddress: null,
  })
  const { t } = useTranslation()
  const { account, library } = useWeb3React()
  const { isLoading: isProfileLoading, profile, refresh: refreshProfile } = useProfile()
  const { nfts, isLoading } = useNftsForAddress(account, profile, isProfileLoading)
  const profileContract = useProfileContract()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftsInWallet = useMemo(() => nfts.filter((nft) => nft.location === NftLocation.WALLET), [nfts])

  const { data } = useApprovalNfts(nftsInWallet)

  const isAlreadyApproved = useMemo(() => {
    return data ? !!data[selectedNft.tokenId] : false
  }, [data, selectedNft.tokenId])

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onApprove: () => {
        const contract = getErc721Contract(selectedNft.collectionAddress, library.getSigner())

        return callWithGasPrice(contract, 'approve', [getPancakeProfileAddress(), selectedNft.tokenId])
      },
      onConfirm: () => {
        if (!profile.isActive) {
          return callWithGasPrice(profileContract, 'reactivateProfile', [
            selectedNft.collectionAddress,
            selectedNft.tokenId,
          ])
        }

        return callWithGasPrice(profileContract, 'updateProfile', [selectedNft.collectionAddress, selectedNft.tokenId])
      },
      onSuccess: async ({ receipt }) => {
        // Re-fetch profile
        refreshProfile()
        toastSuccess(t('Profile Updated!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        if (onSuccess) {
          onSuccess()
        }
        onDismiss?.()
      },
    })

  const alreadyApproved = isApproved || isAlreadyApproved

  return (
    <>
      <Text as="p" color="textSubtle" mb="24px">
        {t('Choose a new Collectible to use as your profile pic.')}
      </Text>
      {isLoading ? (
        <Skeleton width="100%" height="80px" mb="16px" />
      ) : nftsInWallet.length > 0 ? (
        <Box maxHeight="300px" overflowY="scroll">
          {nftsInWallet.map((walletNft) => {
            const handleChange = () => {
              setSelectedNft({
                tokenId: walletNft.tokenId,
                collectionAddress: walletNft.collectionAddress,
              })
            }
            return (
              <SelectionCard
                name="profilePicture"
                key={`${walletNft.collectionAddress}#${walletNft.tokenId}`}
                value={walletNft.tokenId}
                image={walletNft.image.thumbnail}
                isChecked={walletNft.tokenId === selectedNft.tokenId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed}
              >
                <Text bold>{walletNft.name}</Text>
              </SelectionCard>
            )
          })}
        </Box>
      ) : (
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
        isApproveDisabled={isConfirmed || isConfirming || alreadyApproved || selectedNft.tokenId === null}
        isApproving={isApproving}
        isConfirmDisabled={!alreadyApproved || isConfirmed || selectedNft.tokenId === null}
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
