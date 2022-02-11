import React from 'react'
import styled from 'styled-components'
import { Flex } from '@tovaswapui/uikit'
import sum from 'lodash/sum'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import MainNFTCard from './MainNFTCard'
import ManageNFTsCard from './ManageNFTsCard'
import { TwoColumnsContainer } from '../shared/styles'
import PropertiesCard from '../shared/PropertiesCard'
import DetailsCard from '../shared/DetailsCard'
import useGetCollectionDistribution from '../../../hooks/useGetCollectionDistribution'
import OwnerCard from './OwnerCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import ActivityCard from './ActivityCard'
import { useCompleteNft } from '../../../hooks/useCompleteNft'

interface IndividualNFTPageProps {
  collectionAddress: string
  tokenId: string
}

const OwnerActivityContainer = styled(Flex)`
  gap: 22px;
`

const IndividualNFTPage: React.FC<IndividualNFTPageProps> = ({ collectionAddress, tokenId }) => {
  const { data: distributionData, isFetching: isFetchingDistribution } = useGetCollectionDistribution(collectionAddress)
  const {
    combinedNft: nft,
    isOwn: isOwnNft,
    isProfilePic,
    isLoading,
    refetch,
  } = useCompleteNft(collectionAddress, tokenId)

  if (!nft) {
    // Normally we already show a 404 page here if no nft, just put this checking here for safety.

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  const properties = nft.attributes

  const getAttributesRarity = () => {
    if (distributionData && !isFetchingDistribution) {
      return Object.keys(distributionData).reduce((rarityMap, traitType) => {
        const total = sum(Object.values(distributionData[traitType]))
        const nftAttributeValue = nft.attributes.find((attribute) => attribute.traitType === traitType)?.value
        const count = distributionData[traitType][nftAttributeValue]
        const rarity = (count / total) * 100
        return {
          ...rarityMap,
          [traitType]: rarity,
        }
      }, {})
    }
    return {}
  }

  return (
    <Page>
      <MainNFTCard nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={isProfilePic} onSuccess={refetch} />
      <TwoColumnsContainer flexDirection={['column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageNFTsCard nft={nft} isOwnNft={isOwnNft} isLoading={isLoading} onSuccess={refetch} />
          <PropertiesCard properties={properties} rarity={getAttributesRarity()} />
          <DetailsCard contractAddress={collectionAddress} ipfsJson={nft?.marketData?.metadataUrl} />
        </Flex>
        <OwnerActivityContainer flexDirection="column" width="100%">
          <OwnerCard nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={isProfilePic} onSuccess={refetch} />
          <ActivityCard nft={nft} />
        </OwnerActivityContainer>
      </TwoColumnsContainer>
      <MoreFromThisCollection collectionAddress={collectionAddress} currentTokenName={nft.name} />
    </Page>
  )
}

export default IndividualNFTPage
