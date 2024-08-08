import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, Card, CardBody, Heading, Skeleton, Text, useToast } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import { pancakeProfileABI } from 'config/abi/pancakeProfile'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useProfile } from 'hooks/useProfile'
import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getErc721Contract, getProfileContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/wagmi'
import { nftsBaseUrl } from 'views/ProfileCreation/Nft/constants'
import { useNftsForAddress } from 'views/ProfileCreation/Nft/hooks/useNftsForAddress'
import { NftLocation, NftToken } from 'views/ProfileCreation/Nft/type'
import { useAccount, useWalletClient } from 'wagmi'
import NextStepButton from './NextStepButton'
import SelectionCard from './SelectionCard'
import useProfileCreation from './contexts/hook'

const Link = styled(NextLinkFromReactRouter)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div`
  margin-bottom: 24px;
`

const ProfilePicture: React.FC = () => {
  const { address: account } = useAccount()
  const [isApproved, setIsApproved] = useState(false)
  const [isProfileNftsLoading, setIsProfileNftsLoading] = useState(true)
  const [userProfileCreationNfts, setUserProfileCreationNfts] = useState<NftToken[] | null>(null)
  const { selectedNft, actions } = useProfileCreation()

  const { isLoading: isProfileFetching, profile } = useProfile()
  const { nfts, isLoading: isUserNftLoading } = useNftsForAddress({
    account: account || '',
    profile,
    isProfileFetching,
  })

  useEffect(() => {
    const fetchUserPancakeCollectibles = async () => {
      try {
        const nftsByCollection = Array.from(
          nfts.reduce((acc, value) => {
            acc.add(value.collectionAddress)
            return acc
          }, new Set<string>()),
        )

        if (nftsByCollection.length > 0) {
          const profileContract = getProfileContract()
          const nftRole = await profileContract.read.NFT_ROLE()
          const collectionRoles = await publicClient({ chainId: ChainId.BSC }).multicall({
            contracts: nftsByCollection.map((collectionAddress) => {
              return {
                abi: pancakeProfileABI,
                address: getPancakeProfileAddress(),
                functionName: 'hasRole',
                args: [nftRole, collectionAddress],
              }
            }),
            allowFailure: false,
          })

          setUserProfileCreationNfts(
            nfts.filter((nft) => collectionRoles[nftsByCollection.indexOf(nft.collectionAddress)]),
          )
        } else {
          setUserProfileCreationNfts(null)
        }
      } catch (e) {
        console.error(e)
        setUserProfileCreationNfts(null)
      } finally {
        setIsProfileNftsLoading(false)
      }
    }
    if (!isUserNftLoading) {
      setIsProfileNftsLoading(true)
      fetchUserPancakeCollectibles()
    }
  }, [nfts, isUserNftLoading])

  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { data: walletClient } = useWalletClient()

  const handleApprove = async () => {
    if (!walletClient) return

    const contract = getErc721Contract(selectedNft.collectionAddress!, walletClient)
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(contract, 'approve', [getPancakeProfileAddress(), BigInt(selectedNft.tokenId!)])
    })
    if (receipt?.status) {
      toastSuccess(t('Enabled'), t('Please progress to the next step.'))
      setIsApproved(true)
    }
  }

  if (!userProfileCreationNfts?.length && !isProfileNftsLoading) {
    return (
      <>
        <Heading scale="xl" mb="24px">
          {t('Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {t('We couldn’t find any Pancake Collectibles in your wallet.')}
        </Text>
        <Text as="p" mb="24px">
          {t('Only approved Pancake Collectibles can be used.')}
          <Link to="https://pancakeswap.finance/profile/pancake-collectibles" style={{ marginLeft: '4px' }}>
            {t('See the list >')}
          </Link>
        </Text>
        <Text as="p">
          {t(
            'You need a Pancake Collectible to finish setting up your profile. If you sold or transferred your starter collectible to another wallet, you’ll need to get it back or acquire a new one somehow. You can’t make a new starter with this wallet address.',
          )}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 2 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Set Profile Picture')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.')}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {t('Only approved Pancake Collectibles can be used.')}
            <Link to={`${nftsBaseUrl}/collections`} style={{ marginLeft: '4px' }}>
              {t('See the list >')}
            </Link>
          </Text>
          <NftWrapper>
            {userProfileCreationNfts?.length ? (
              userProfileCreationNfts
                .filter((walletNft) => walletNft.location === NftLocation.WALLET)
                .map((walletNft) => {
                  return (
                    <SelectionCard
                      name="profilePicture"
                      key={`${walletNft.collectionAddress}#${walletNft.tokenId}`}
                      value={walletNft.tokenId}
                      image={walletNft.image.thumbnail}
                      isChecked={walletNft.tokenId === selectedNft.tokenId}
                      onChange={(value: string) => actions.setSelectedNft(value, walletNft.collectionAddress)}
                    >
                      <Text bold>{walletNft.name}</Text>
                    </SelectionCard>
                  )
                })
            ) : (
              <Skeleton width="100%" height="64px" />
            )}
          </NftWrapper>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Allow collectible to be locked')}
          </Heading>
          <Text as="p" color="textSubtle" mb="16px">
            {t(
              "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
            )}
          </Text>
          <Button
            isLoading={isApproving}
            disabled={isApproved || isApproving || !selectedNft.tokenId}
            onClick={handleApprove}
            endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            id="approveStarterCollectible"
          >
            {t('Enable')}
          </Button>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!selectedNft.tokenId || !isApproved || isApproving}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default ProfilePicture
