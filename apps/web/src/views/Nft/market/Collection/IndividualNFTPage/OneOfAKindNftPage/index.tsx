import { Flex } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import fromPairs from 'lodash/fromPairs'
import noop from 'lodash/noop'
import sum from 'lodash/sum'
import { useMemo } from 'react'
import { useGetCollection } from 'state/nftMarket/hooks'
import { styled } from 'styled-components'
import { Address } from 'viem'
import { useCompleteNft } from '../../../hooks/useCompleteNft'
import useGetCollectionDistribution from '../../../hooks/useGetCollectionDistribution'
import DetailsCard from '../shared/DetailsCard'
import ManageNFTsCard from '../shared/ManageNFTsCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import PropertiesCard from '../shared/PropertiesCard'
import { TwoColumnsContainer } from '../shared/styles'
import ActivityCard from './ActivityCard'
import MainNFTCard from './MainNFTCard'
import OwnerCard from './OwnerCard'

interface IndividualNFTPageProps {
  collectionAddress: Address | undefined
  tokenId: string
}

const OwnerActivityContainer = styled(Flex)`
  gap: 22px;
`

const IndividualNFTPage: React.FC<React.PropsWithChildren<IndividualNFTPageProps>> = ({
  collectionAddress,
  tokenId,
}) => {
  const collection = useGetCollection(collectionAddress)
  const { data: distributionData, isFetching: isFetchingDistribution } = useGetCollectionDistribution(collectionAddress)
  const { combinedNft: nft, isOwn: isOwnNft, isProfilePic, refetch } = useCompleteNft(collectionAddress, tokenId)

  const properties = nft?.attributes

  const attributesRarity = useMemo(() => {
    if (distributionData && !isFetchingDistribution && properties) {
      return fromPairs(
        Object.keys(distributionData).map((traitType) => {
          const total = sum(Object.values(distributionData[traitType]))
          const nftAttributeValue = properties.find((attribute) => attribute.traitType === traitType)?.value
          const count = nftAttributeValue ? distributionData[traitType][nftAttributeValue] : 0
          const rarity = (count / total) * 100
          return [traitType, rarity]
        }),
      )
    }
    return {}
  }, [properties, isFetchingDistribution, distributionData])

  if (!nft || !collection) {
    // Normally we already show a 404 page here if no nft, just put this checking here for safety.

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  return (
    <Page>
      <MainNFTCard nft={nft} isOwnNft={isOwnNft} nftIsProfilePic={isProfilePic} onSuccess={refetch} />
      <TwoColumnsContainer flexDirection={['column', 'column', 'column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          <ManageNFTsCard collection={collection} tokenId={tokenId} onSuccess={isOwnNft ? refetch : noop} />
          <PropertiesCard properties={properties ?? []} rarity={attributesRarity} />
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
