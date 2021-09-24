import React, { useEffect, useState } from 'react'
import { Skeleton, Table, Td, Th, Image, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import times from 'lodash/times'
import sum from 'lodash/sum'
import { formatNumber } from 'utils/formatBalance'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiResponseCollectionTokens } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import CollapsibleCard from 'components/CollapsibleCard'
import useGetLowestPBNftPrice from '../../hooks/useGetLowestPBPrice'
import { BNBAmountLabel } from '../../components/CollectibleCard/styles'

interface PancakeBunniesTraitsProps {
  collectionAddress: string
}

const NftImage = styled(Image)`
  & > img {
    border-radius: 8px;
  }
`

const NftName: React.FC<{ thumbnailSrc: string; name: string }> = ({ thumbnailSrc, name }) => (
  <Flex alignItems="center">
    <NftImage src={thumbnailSrc} width={48} height={48} mr="8px" />
    <Text>{name}</Text>
  </Flex>
)

const LowestPriceCell: React.FC<{ bunnyId: string }> = ({ bunnyId }) => {
  const { isFetching, lowestPrice } = useGetLowestPBNftPrice(bunnyId)

  if (isFetching) {
    return (
      <Flex justifyContent="center">
        <Skeleton height="24px" width="48px" />
      </Flex>
    )
  }

  if (!lowestPrice) {
    return null
  }

  return <BNBAmountLabel justifyContent="center" amount={lowestPrice} />
}

const PancakeBunniesTraits: React.FC<PancakeBunniesTraitsProps> = ({ collectionAddress }) => {
  const [tokenApiResponse, setTokenApiResponse] = useState<ApiResponseCollectionTokens>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const fetchTokens = async () => {
      const apiResponse = await getNftsFromCollectionApi(collectionAddress)
      setTokenApiResponse(apiResponse)
    }

    fetchTokens()
  }, [collectionAddress, setTokenApiResponse])

  const totalMinted = tokenApiResponse ? sum(Object.values(tokenApiResponse.attributesDistribution)) : 0

  return (
    <>
      {tokenApiResponse ? (
        <CollapsibleCard title="Bunny Id">
          <Table>
            <thead>
              <tr>
                <Th textAlign="left">{t('Name')}</Th>
                <Th>{t('Count')}</Th>
                <Th>{t('Rarity')}</Th>
                <Th>{t('Lowest')}</Th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(tokenApiResponse.data).map((bunnyId) => {
                const nft = tokenApiResponse.data[bunnyId]
                if (!nft) {
                  // Some bunnies don't exist on testnet
                  return null
                }
                const count: number = tokenApiResponse.attributesDistribution[bunnyId] ?? 0
                const percentage = (count / totalMinted) * 100

                return (
                  <tr key={bunnyId}>
                    <Td>
                      <NftName thumbnailSrc={nft.image.thumbnail} name={nft.name} />
                    </Td>
                    <Td textAlign="center">{formatNumber(count, 0, 0)}</Td>
                    <Td textAlign="center">{`${formatNumber(percentage, 0, 2)}%`}</Td>
                    <Td textAlign="center">
                      <LowestPriceCell bunnyId={bunnyId} />
                    </Td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </CollapsibleCard>
      ) : (
        <CollapsibleCard title={t('Loading...')}>
          <Table>
            <thead>
              <tr>
                <Th textAlign="left">{t('Name')}</Th>
                <Th>{t('Count')}</Th>
                <Th>{t('Rarity')}</Th>
                <Th>{t('Lowest')}</Th>
              </tr>
            </thead>
            <tbody>
              {times(19).map((bunnyCnt) => (
                <tr key={bunnyCnt}>
                  <Td>
                    <Flex alignItems="center">
                      <Skeleton height="48px" width="48px" mr="8px" />
                      <Skeleton width="100px" />
                    </Flex>
                  </Td>
                  <Td>
                    <Skeleton />
                  </Td>
                  <Td>
                    <Skeleton />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CollapsibleCard>
      )}
    </>
  )
}

export default PancakeBunniesTraits
