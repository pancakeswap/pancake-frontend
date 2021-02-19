import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { AutoRenewIcon, Button, Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { Link as RouterLink } from 'react-router-dom'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import nftList from 'config/constants/nfts'
import useI18n from 'hooks/useI18n'
import { useToast } from 'state/hooks'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { usePancakeRabbits } from 'hooks/useContract'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div`
  margin-bottom: 24px;
`

const ProfilePicture: React.FC = () => {
  const [isApproved, setIsApproved] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const { tokenId, actions } = useContext(ProfileCreationContext)
  const TranslateString = useI18n()
  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts()
  const pancakeRabbitsContract = usePancakeRabbits()
  const { account } = useWallet()
  const { toastError } = useToast()
  const bunnyIds = Object.keys(nftsInWallet).map((nftWalletItem) => Number(nftWalletItem))
  const walletNfts = nftList.filter((nft) => bunnyIds.includes(nft.bunnyId))

  const handleApprove = () => {
    pancakeRabbitsContract.methods
      .approve(getPancakeProfileAddress(), tokenId)
      .send({ from: account })
      .on('sending', () => {
        setIsApproving(true)
      })
      .on('receipt', () => {
        setIsApproving(false)
        setIsApproved(true)
      })
      .on('error', (error) => {
        toastError('Error', error?.message)
        setIsApproving(false)
      })
  }

  if (!isLoading && walletNfts.length === 0) {
    return (
      <>
        <Heading size="xl" mb="24px">
          {TranslateString(852, 'Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {TranslateString(854, 'We couldn’t find any Pancake Collectibles in your wallet.')}
        </Text>
        <Text as="p">
          {TranslateString(
            856,
            'You need a Pancake Collectible to finish setting up your profile. If you sold or transferred your starter collectible to another wallet, you’ll need to get it back or acquire a new one somehow. You can’t make a new starter with this wallet address.',
          )}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {TranslateString(999, `Step ${2}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {TranslateString(778, 'Set Profile Picture')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(812, 'Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {TranslateString(
              814,
              'Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.',
            )}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            {TranslateString(816, 'Only approved Pancake Collectibles can be used.')}
            <Link to="/collectibles" style={{ marginLeft: '4px' }}>
              {TranslateString(999, 'See the list >')}
            </Link>
          </Text>
          <NftWrapper>
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
                    onChange={(value: string) => actions.setTokenId(parseInt(value, 10))}
                  >
                    <Text bold>{walletNft.name}</Text>
                  </SelectionCard>
                )
              })
            )}
          </NftWrapper>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(818, 'Allow collectible to be locked')}
          </Heading>
          <Text as="p" color="textSubtle" mb="16px">
            {TranslateString(
              820,
              "The collectible you've chosen will be locked in a smart contract while it’s being used as your profile picture. Don't worry - you'll be able to get it back at any time.",
            )}
          </Text>
          <Button
            isLoading={isApproving}
            disabled={isApproved || isApproving || tokenId === null}
            onClick={handleApprove}
            endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
            {TranslateString(564, 'Approve')}
          </Button>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={tokenId === null || !isApproved || isApproving}>
        {TranslateString(798, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default ProfilePicture
