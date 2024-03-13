import { Flex } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import { useEffect, useState } from 'react'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { useGetCollection } from 'state/nftMarket/hooks'
import { ApiResponseCollectionTokens, NftToken } from 'state/nftMarket/types'
import { useGetCollectionDistributionPB } from 'views/Nft/market/hooks/useGetCollectionDistribution'
import { pancakeBunniesAddress } from '../../../constants'
import { usePancakeBunnyCheapestNft } from '../../../hooks/usePancakeBunnyCheapestNfts'
import DetailsCard from '../shared/DetailsCard'
import ManageNftsCard from '../shared/ManageNFTsCard'
import MoreFromThisCollection from '../shared/MoreFromThisCollection'
import PropertiesCard from '../shared/PropertiesCard'
import { TwoColumnsContainer } from '../shared/styles'
import ForSaleTableCard from './ForSaleTableCard'
import MainPancakeBunnyCard from './MainPancakeBunnyCard'

interface IndividualPancakeBunnyPageProps {
  bunnyId: string
}

const IndividualPancakeBunnyPage = (props: IndividualPancakeBunnyPageProps) => {
  const collection = useGetCollection(pancakeBunniesAddress)

  if (!collection) {
    return <PageLoader />
  }

  return <IndividualPancakeBunnyPageBase {...props} />
}

const IndividualPancakeBunnyPageBase: React.FC<React.PropsWithChildren<IndividualPancakeBunnyPageProps>> = ({
  bunnyId,
}) => {
  const collection = useGetCollection(pancakeBunniesAddress)
  const totalBunnyCount = Number(collection?.totalSupply)
  const [nothingForSaleBunny, setNothingForSaleBunny] = useState<NftToken | null>(null)
  const [nftMetadata, setNftMetadata] = useState<ApiResponseCollectionTokens | null>(null)
  const {
    data: cheapestBunny,
    isFetched: isFetchedCheapestBunny,
    refresh: refreshCheapestNft,
  } = usePancakeBunnyCheapestNft(bunnyId, nftMetadata)

  const { data: distributionData, isFetching: isFetchingDistribution } = useGetCollectionDistributionPB()

  useEffect(() => {
    if (!nftMetadata) {
      getNftsFromCollectionApi(pancakeBunniesAddress).then(
        (metadata) => {
          setNftMetadata(metadata)
        },
        () => {
          // do nothing.
        },
      )
    }
  }, [nftMetadata])

  useEffect(() => {
    const fetchBasicBunnyData = async () => {
      if (!nftMetadata || !nftMetadata.data) return
      setNothingForSaleBunny({
        // In this case tokenId doesn't matter, this token can't be bought
        tokenId: nftMetadata.data[bunnyId].name,
        name: nftMetadata.data[bunnyId].name,
        description: nftMetadata.data[bunnyId].description,
        collectionName: nftMetadata.data[bunnyId].collection.name,
        collectionAddress: pancakeBunniesAddress,
        image: nftMetadata.data[bunnyId].image,
        attributes: [
          {
            traitType: 'bunnyId',
            value: bunnyId,
            displayType: null,
          },
        ],
      })
    }

    // If bunny id has no listings on the market - get basic bunny info
    if (isFetchedCheapestBunny && !cheapestBunny && nftMetadata && nftMetadata.data) {
      fetchBasicBunnyData()
    }
  }, [cheapestBunny, isFetchedCheapestBunny, nftMetadata, bunnyId])

  if (!cheapestBunny && !nothingForSaleBunny) {
    // TODO redirect to nft market page if collection or bunny id does not exist (came here from some bad url)
    // That would require tracking loading states and stuff...

    // For now this if is used to show loading spinner while we're getting the data
    return <PageLoader />
  }

  const getBunnyIdCount = () => {
    if (distributionData && !isFetchingDistribution) {
      return distributionData[bunnyId]?.tokenCount
    }
    return null
  }

  const getBunnyIdRarity = () => {
    if (distributionData && !isFetchingDistribution) {
      return (distributionData[bunnyId]?.tokenCount / totalBunnyCount) * 100
    }
    return null
  }

  const properties = cheapestBunny?.attributes || nothingForSaleBunny?.attributes

  const propertyRarity = { bunnyId: getBunnyIdRarity() }

  return (
    <Page>
      <MainPancakeBunnyCard
        cheapestNft={cheapestBunny ?? undefined}
        nothingForSaleBunny={nothingForSaleBunny ?? undefined}
        onSuccessSale={refreshCheapestNft}
      />
      <TwoColumnsContainer flexDirection={['column', 'column', 'column', 'row']}>
        <Flex flexDirection="column" width="100%">
          {collection ? (
            <ManageNftsCard
              collection={collection}
              tokenId={bunnyId}
              lowestPrice={cheapestBunny?.marketData?.currentAskPrice}
            />
          ) : null}
          <PropertiesCard properties={properties ?? []} rarity={propertyRarity} />
          <DetailsCard
            contractAddress={pancakeBunniesAddress}
            ipfsJson={cheapestBunny?.marketData?.metadataUrl}
            rarity={propertyRarity?.bunnyId ?? 0}
            count={getBunnyIdCount() ?? 0}
          />
        </Flex>
        <ForSaleTableCard bunnyId={bunnyId} nftMetadata={nftMetadata} onSuccessSale={refreshCheapestNft} />
      </TwoColumnsContainer>
      <MoreFromThisCollection
        collectionAddress={pancakeBunniesAddress}
        currentTokenName={cheapestBunny?.name || nothingForSaleBunny?.name}
      />
    </Page>
  )
}

export default IndividualPancakeBunnyPage
