import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { useTranslation } from 'contexts/Localization'
import { useUserNfts } from 'state/nftMarket/hooks'
import { ToastDescriptionWithTx } from 'components/Toast'
import useToast from 'hooks/useToast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { NftLocation, UserNftInitializationState } from 'state/nftMarket/types'
import SelectionCard from './SelectionCard'
import NextStepButton from './NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'
import { useProfileContract } from '../../hooks/useContract'
import multicall from '../../utils/multicall'
import profileABI from '../../config/abi/pancakeProfile.json'

const Link = styled(NextLinkFromReactRouter)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div`
  margin-bottom: 24px;
`

const ProfilePicture: React.FC = () => {
  const { library } = useWeb3React()
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [userProfileCreationNfts, setUserProfileCreationNfts] = useState(null)
  const { selectedNft, actions } = useContext(ProfileCreationContext)
  const profileContract = useProfileContract(false)

  const { nfts, userNftsInitializationState } = useUserNfts()

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
          const nftRole = await profileContract.NFT_ROLE()
          const collectionsNftRoleCalls = nftsByCollection.map((collectionAddress) => {
            return {
              address: profileContract.address,
              name: 'hasRole',
              params: [nftRole, collectionAddress],
            }
          })
          const collectionRolesRaw = await multicall(profileABI, collectionsNftRoleCalls)
          const collectionRoles = collectionRolesRaw.flat()
          setUserProfileCreationNfts(
            nfts.filter((nft) => collectionRoles[nftsByCollection.indexOf(nft.collectionAddress)]),
          )
        }
      } catch (e) {
        console.error(e)
      }
    }
    if (userNftsInitializationState === UserNftInitializationState.INITIALIZED) {
      fetchUserPancakeCollectibles()
    }
  }, [nfts, profileContract, userNftsInitializationState])

  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleApprove = async () => {
    const contract = getErc721Contract(selectedNft.collectionAddress, library.getSigner())
    const tx = await callWithGasPrice(contract, 'approve', [getPancakeProfileAddress(), selectedNft.tokenId])
    toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx.hash} />)
    setIsApproving(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Enabled'), t('Please progress to the next step.'))
      setIsApproving(false)
      setIsApproved(true)
    } else {
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      setIsApproving(false)
    }
  }

  if (userProfileCreationNfts?.length === 0) {
    return (
      <>
        <Heading scale="xl" mb="24px">
          {t('Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {t('We couldn’t find any Pancake Collectibles in your wallet.')}
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
            {userProfileCreationNfts?.length > 0 ? (
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
            disabled={isApproved || isApproving || selectedNft.tokenId === null}
            onClick={handleApprove}
            endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
            id="approveStarterCollectible"
          >
            {t('Enable')}
          </Button>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={selectedNft.tokenId === null || !isApproved || isApproving}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default ProfilePicture
