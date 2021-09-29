import React, { useEffect, useMemo, useState } from 'react'
import { Skeleton, Table, Td, Th, Image, Flex, Text, ArrowUpIcon, ArrowDownIcon } from '@pancakeswap/uikit'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import times from 'lodash/times'
import sum from 'lodash/sum'
import { formatNumber } from 'utils/formatBalance'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiResponseCollectionTokens } from 'state/nftMarket/types'
import { useNftsFromCollection } from 'state/nftMarket/hooks'
import { useTranslation } from 'contexts/Localization'
import CollapsibleCard from 'components/CollapsibleCard'
import useGetLowestPBNftPrice from '../../hooks/useGetLowestPBPrice'
import { BNBAmountLabel } from '../../components/CollectibleCard/styles'
import { SortType } from './types'
import { StyledSortButton } from './styles'
import { sortBunniesByRarirityBuilder } from './utils'
import { nftsBaseUrl } from '../../constants'

interface PancakeBunniesTraitsProps {
  collectionAddress: string
}

const NftImage = styled(Image)`
  flex: none;
  & > img {
    border-radius: 8px;
  }
`

const ClickableRow = styled.tr`
  cursor: pointer;

  &:hover {
    td {
      opacity: 0.65;
    }
  }
`

const TableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  min-width: 320px;
  overflow-x: auto;
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
      <Flex justifyContent="flex-end" width="100px">
        <Skeleton height="24px" width="48px" />
      </Flex>
    )
  }

  if (!lowestPrice) {
    return null
  }

  return <BNBAmountLabel justifyContent="flex-end" amount={lowestPrice} width="100px" />
}

const PancakeBunniesTraits: React.FC<PancakeBunniesTraitsProps> = ({ collectionAddress }) => {
  const [tokenApiResponse, setTokenApiResponse] = useState<ApiResponseCollectionTokens>(null)
  const [rarirySort, setRarirySort] = useState<SortType>('asc')
  const nfts = useNftsFromCollection(collectionAddress)
  const { t } = useTranslation()
  const { push } = useHistory()

  useEffect(() => {
    const fetchTokens = async () => {
      const apiResponse = await getNftsFromCollectionApi(collectionAddress)
      setTokenApiResponse(apiResponse)
    }

    fetchTokens()
  }, [collectionAddress, setTokenApiResponse])

  const totalMinted = tokenApiResponse ? sum(Object.values(tokenApiResponse.attributesDistribution)) : 0

  const sortedBunnieKeys = useMemo(() => {
    if (!tokenApiResponse) return []

    return Object.keys(tokenApiResponse.data).sort(sortBunniesByRarirityBuilder({ rarirySort, data: tokenApiResponse }))
  }, [rarirySort, tokenApiResponse])

  const toggleRarirySort = () => {
    setRarirySort((currentValue) => (currentValue === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <>
      {tokenApiResponse ? (
        <CollapsibleCard title="Bunny Id">
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th textAlign="left">{t('Name')}</Th>
                  <Th>{t('Count')}</Th>
                  <Th>
                    <StyledSortButton type="button" onClick={toggleRarirySort}>
                      <Flex alignItems="center">
                        {t('Rarity')}
                        {rarirySort === 'asc' ? <ArrowUpIcon color="secondary" /> : <ArrowDownIcon color="secondary" />}
                      </Flex>
                    </StyledSortButton>
                  </Th>
                  <Th textAlign="right">{t('Lowest')}</Th>
                </tr>
              </thead>
              <tbody>
                {sortedBunnieKeys.map((bunnyId) => {
                  const nft = tokenApiResponse.data[bunnyId]
                  if (!nft) {
                    // Some bunnies don't exist on testnet
                    return null
                  }
                  const count: number = tokenApiResponse.attributesDistribution[bunnyId] ?? 0
                  const percentage = (count / totalMinted) * 100
                  const handleClick = () => {
                    // Find the corresponding bunny id
                    const nftInCollection = nfts.find((nftInState) => nftInState.name === nft.name)

                    if (nftInCollection && nftInCollection.marketData?.otherId) {
                      push(`${nftsBaseUrl}/collections/${collectionAddress}/${nftInCollection.marketData.otherId}`)
                    }
                  }

                  return (
                    <ClickableRow key={bunnyId} onClick={handleClick} title={t('Click to view NFT')}>
                      <Td>
                        <NftName thumbnailSrc={nft.image.thumbnail} name={nft.name} />
                      </Td>
                      <Td textAlign="center">{formatNumber(count, 0, 0)}</Td>
                      <Td textAlign="center">{`${formatNumber(percentage, 0, 2)}%`}</Td>
                      <Td textAlign="right" width="100px">
                        <LowestPriceCell bunnyId={bunnyId} />
                      </Td>
                    </ClickableRow>
                  )
                })}
              </tbody>
            </Table>
          </TableWrapper>
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
