import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, InjectedModalProps, Link, Skeleton, StyledLink, Text, useToast } from '@pancakeswap/uikit'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useProfileContract } from 'hooks/useContract'
import get from 'lodash/get'
import { useMemo, useState } from 'react'
import { useApprovalNfts } from 'state/nftMarket/hooks'
import { useProfile } from 'state/profile/hooks'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { Address } from 'viem'
import SelectionCard from 'views/ProfileCreation/SelectionCard'
import { useWalletClient } from 'wagmi'
import { useUserProfileCreationNfts } from 'views/Nft/market/hooks/useUserProfileCreationNfts'

interface ChangeProfilePicPageProps extends InjectedModalProps {
  onSuccess?: () => void
}

interface SelectedNFTType {
  tokenId: string
  collectionAddress: Address
}

const ChangeProfilePicPage: React.FC<React.PropsWithChildren<ChangeProfilePicPageProps>> = ({
  onDismiss,
  onSuccess,
}) => {
  const [selectedNft, setSelectedNft] = useState<SelectedNFTType | undefined>()
  const { t } = useTranslation()
  const { data: signer } = useWalletClient()
  const { profile, refresh: refreshProfile } = useProfile()
  const { userProfileCreationNfts, isLoading: isUserProfileCreationNftsLoading } = useUserProfileCreationNfts()
  const profileContract = useProfileContract()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { data } = useApprovalNfts(userProfileCreationNfts)

  const isAlreadyApproved = useMemo(() => {
    return data && selectedNft?.tokenId ? !!get(data, selectedNft.tokenId) : false
  }, [data, selectedNft?.tokenId])

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        if (!selectedNft?.tokenId || !selectedNft?.collectionAddress || !signer || !selectedNft?.tokenId) return true
        const contract = getErc721Contract(selectedNft?.collectionAddress, signer)
        const approvedAddress = await contract.read.getApproved([BigInt(selectedNft.tokenId)])
        return approvedAddress !== getPancakeProfileAddress()
      },
      onApprove: () => {
        if (!selectedNft?.collectionAddress || !signer) return undefined

        const contract = getErc721Contract(selectedNft.collectionAddress, signer)

        return callWithGasPrice(contract, 'approve', [getPancakeProfileAddress(), BigInt(selectedNft.tokenId)])
      },
      onConfirm: () => {
        if (!selectedNft?.collectionAddress || !selectedNft?.tokenId) return undefined

        if (!profile?.isActive) {
          return callWithGasPrice(profileContract, 'reactivateProfile', [
            selectedNft.collectionAddress,
            BigInt(selectedNft.tokenId),
          ])
        }

        return callWithGasPrice(profileContract, 'updateProfile', [
          selectedNft.collectionAddress,
          BigInt(selectedNft.tokenId),
        ])
      },
      onSuccess: async ({ receipt }) => {
        // Re-fetch profile
        refreshProfile()
        toastSuccess(t('Profile Updated!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        onSuccess?.()
        onDismiss?.()
      },
    })

  const alreadyApproved = isApproved || isAlreadyApproved

  return (
    <>
      <Text as="p" color="textSubtle" mb="24px">
        {t('Choose a new Collectible to use as your profile pic.')}
      </Text>
      {isUserProfileCreationNftsLoading ? (
        <Skeleton width="100%" height="80px" mb="16px" />
      ) : userProfileCreationNfts.length > 0 ? (
        <Box maxHeight="300px" overflowY="scroll">
          {userProfileCreationNfts.map((walletNft) => {
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
                isChecked={walletNft.tokenId === selectedNft?.tokenId}
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
            <Link href="/profile/pancake-collectibles">
              <StyledLink color="primary">{t('See the list >')}</StyledLink>
            </Link>
          </Text>
        </>
      )}
      <ApproveConfirmButtons
        isApproveDisabled={isConfirmed || isConfirming || alreadyApproved || selectedNft?.tokenId === undefined}
        isApproving={isApproving}
        isConfirmDisabled={!alreadyApproved || isConfirmed || selectedNft?.tokenId === undefined}
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
