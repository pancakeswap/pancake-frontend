import React, { useContext } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { Link as RouterLink } from 'react-router-dom'
import nftList from 'config/constants/nfts'
import useI18n from 'hooks/useI18n'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div``

const ProfilePicture: React.FC = () => {
  const { tokenId, actions } = useContext(ProfileCreationContext)
  const TranslateString = useI18n()
  const { isLoading, nfts: nftsInWallet } = useGetWalletNfts()
  const bunnyIds = Object.keys(nftsInWallet).map((nftWalletItem) => Number(nftWalletItem))
  const walletNfts = nftList.filter((nft) => bunnyIds.includes(nft.bunnyId))

  if (!isLoading && walletNfts.length === 0) {
    return (
      <>
        <Heading size="xl" mb="24px">
          {TranslateString(999, 'Oops!')}
        </Heading>
        <Text bold fontSize="20px" mb="24px">
          {TranslateString(999, 'We couldn’t find any Pancake Collectibles in your wallet.')}
        </Text>
        <Text as="p">
          {TranslateString(
            999,
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
        {TranslateString(999, 'Set Profile Picture')}
      </Heading>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(999, 'Choose collectible')}
          </Heading>
          <Text as="p" color="textSubtle">
            {TranslateString(
              999,
              'Choose a profile picture from the eligible collectibles (NFT) in your wallet, shown below.',
            )}
          </Text>
          <Text as="p" color="textSubtle" mb="24px">
            <Link to="/nft">{TranslateString(999, 'Only approved Pancake Collectibles can be used.')}</Link>
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
                    image={walletNft.previewImage}
                    isChecked={firstTokenId === tokenId}
                    onChange={(value: string) => actions.setTokenId(parseInt(value, 10))}
                  >
                    <Text bold>{walletNft.name}</Text>
                  </SelectionCard>
                )
              })
            )}
          </NftWrapper>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={tokenId === null}>
        {TranslateString(999, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default ProfilePicture
