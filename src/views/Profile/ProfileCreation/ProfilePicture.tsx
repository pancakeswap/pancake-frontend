import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Skeleton, Text } from '@pancakeswap-libs/uikit'
import { Link as RouterLink } from 'react-router-dom'
import nftList from 'config/constants/nfts'
import useI18n from 'hooks/useI18n'
import useGetWalletNfts from 'hooks/useGetWalletNfts'
import NftSelectionCard from '../components/NftSelectionCard'
import NextStepButton from '../components/NextStepButton'

interface ProfilePictureProps {
  nextStep: () => void
}

const Link = styled(RouterLink)`
  color: ${({ theme }) => theme.colors.primary};
`

const NftWrapper = styled.div``

const ProfilePicture: React.FC<ProfilePictureProps> = ({ nextStep }) => {
  const TranslateString = useI18n()
  const { isLoading, nfts } = useGetWalletNfts()
  const bunnyIds = Object.keys(nfts).map((nftItem) => Number(nftItem))
  const walletNfts = nftList.filter((nft) => bunnyIds.includes(nft.bunnyId))

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
            {isLoading ? <Skeleton height={80} /> : walletNfts.map((walletNft) => <NftSelectionCard nft={walletNft} />)}
          </NftWrapper>
        </CardBody>
      </Card>
      <NextStepButton onClick={nextStep}>{TranslateString(999, 'Next Step')}</NextStepButton>
    </>
  )
}

export default ProfilePicture
