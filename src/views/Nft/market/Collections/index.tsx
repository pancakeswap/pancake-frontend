import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Flex,
  Grid,
  Heading,
  Text,
  Td,
  ProfileAvatar,
  BnbUsdtPairTokenIcon,
  Table,
  Th,
  Card,
  Skeleton,
  useMatchBreakpointsContext,
} from '@pancakeswap/uikit'
import useSWRImmutable from 'swr/immutable'
import orderBy from 'lodash/orderBy'
import { getLeastMostPriceInCollection } from 'state/nftMarket/helpers'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { ViewMode } from 'state/user/actions'
import { Collection } from 'state/nftMarket/types'
import styled from 'styled-components'
import { laggyMiddleware } from 'hooks/useSWRContract'
import { FetchStatus } from 'config/constants/types'
import { useGetShuffledCollections } from 'state/nftMarket/hooks'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from '@pancakeswap/localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import PageLoader from 'components/Loader/PageLoader'
import ToggleView from 'components/ToggleView/ToggleView'
import { CollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'

export const ITEMS_PER_PAGE = 9

const SORT_FIELD = {
  createdAt: 'createdAt',
  volumeBNB: 'totalVolumeBNB',
  items: 'numberTokensListed',
  supply: 'totalSupply',
  lowestPrice: 'lowestPrice',
  highestPrice: 'highestPrice',
}

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

const getNewSortDirection = (oldSortField: string, newSortField: string, oldSortDirection: boolean) => {
  if (oldSortField !== newSortField) {
    return newSortField !== SORT_FIELD.lowestPrice
  }
  return !oldSortDirection
}

const Collectible = () => {
  const { t } = useTranslation()
  const { data: shuffledCollections } = useGetShuffledCollections()
  const { isMobile } = useMatchBreakpointsContext()
  const [sortField, setSortField] = useState(null)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [viewMode, setViewMode] = useState(ViewMode.CARD)
  const [sortDirection, setSortDirection] = useState<boolean>(false)

  const { data: collections = [], status } = useSWRImmutable<
    (Collection & Partial<{ lowestPrice: number; highestPrice: number }>)[]
  >(
    shuffledCollections && shuffledCollections.length ? ['collectionsWithPrice', viewMode, sortField] : null,
    async () => {
      if (viewMode === ViewMode.CARD && sortField !== SORT_FIELD.lowestPrice && sortField !== SORT_FIELD.highestPrice)
        return shuffledCollections
      return Promise.all(
        shuffledCollections.map(async (collection) => {
          const [lowestPrice, highestPrice] = await Promise.all([
            getLeastMostPriceInCollection(collection.address, 'asc'),
            getLeastMostPriceInCollection(collection.address, 'desc'),
          ])
          return {
            ...collection,
            lowestPrice,
            highestPrice,
          }
        }),
      )
    },
    {
      use: [laggyMiddleware],
    },
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  const handleSort = useCallback(
    (newField: string) => {
      setPage(1)
      setSortField(newField)
      setSortDirection(getNewSortDirection(sortField, newField, sortDirection))
    },
    [sortDirection, sortField],
  )

  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        window.scroll({
          top: 50,
          left: 0,
          behavior: 'smooth',
        })
      }, 50)
    }
  }, [isMobile, page])

  useEffect(() => {
    let extraPages = 1
    if (collections.length % ITEMS_PER_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.max(Math.floor(collections.length / ITEMS_PER_PAGE) + extraPages, 1))
  }, [collections])

  const sortedCollections = useMemo(() => {
    return orderBy(
      collections,
      (collection) => {
        if (sortField === SORT_FIELD.createdAt) {
          if (collection.createdAt) {
            return Date.parse(collection.createdAt)
          }
          return null
        }
        return parseFloat(collection[sortField])
      },
      sortDirection ? 'desc' : 'asc',
    )
  }, [collections, sortField, sortDirection])

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" data-test="nft-collections-title">
          {t('Collections')}
        </Heading>
      </PageHeader>
      <Page>
        {status !== FetchStatus.Fetched ? (
          <PageLoader />
        ) : (
          <>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              pr={[null, null, '4px']}
              pl={['4px', null, '0']}
              mb="8px"
            >
              <ToggleView idPrefix="clickCollection" viewMode={viewMode} onToggle={setViewMode} />
              <Flex width="max-content" style={{ gap: '4px' }} flexDirection="column">
                <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600}>
                  {t('Sort By')}
                </Text>
                <Select
                  options={[
                    {
                      label: t('Collection'),
                      value: SORT_FIELD.createdAt,
                    },
                    {
                      label: t('Volume'),
                      value: SORT_FIELD.volumeBNB,
                    },
                    {
                      label: t('Items'),
                      value: SORT_FIELD.items,
                    },
                    {
                      label: t('Supply'),
                      value: SORT_FIELD.supply,
                    },
                    {
                      label: t('Lowest Price'),
                      value: SORT_FIELD.lowestPrice,
                    },
                    {
                      label: t('Highest Price'),
                      value: SORT_FIELD.highestPrice,
                    },
                  ]}
                  placeHolderText={t('Select')}
                  onOptionChange={(option: OptionProps) => handleSort(option.value)}
                />
              </Flex>
            </Flex>
            {viewMode === ViewMode.TABLE ? (
              <Card style={{ overflowX: 'auto' }} mb="32px">
                <Table>
                  <thead>
                    <tr>
                      <Th
                        textAlign="left"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort(SORT_FIELD.createdAt)}
                      >
                        {t('Collection')}
                        {arrow(SORT_FIELD.createdAt)}
                      </Th>
                      <Th
                        textAlign="left"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort(SORT_FIELD.volumeBNB)}
                      >
                        {t('Volume')}
                        {arrow(SORT_FIELD.volumeBNB)}
                      </Th>
                      <Th
                        textAlign="left"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort(SORT_FIELD.lowestPrice)}
                      >
                        {t('Lowest')}
                        {arrow(SORT_FIELD.lowestPrice)}
                      </Th>
                      <Th
                        textAlign="left"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort(SORT_FIELD.highestPrice)}
                      >
                        {t('Highest')}
                        {arrow(SORT_FIELD.highestPrice)}
                      </Th>
                      <Th textAlign="left" style={{ cursor: 'pointer' }} onClick={() => handleSort(SORT_FIELD.items)}>
                        {t('Items')}
                        {arrow(SORT_FIELD.items)}
                      </Th>
                      <Th textAlign="left" style={{ cursor: 'pointer' }} onClick={() => handleSort(SORT_FIELD.supply)}>
                        {t('Supply')}
                        {arrow(SORT_FIELD.supply)}
                      </Th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCollections
                      .map((collection) => {
                        const volume = collection.totalVolumeBNB
                          ? parseFloat(collection.totalVolumeBNB).toLocaleString(undefined, {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })
                          : '0'
                        return (
                          <tr key={collection.address} data-test="nft-collection-row">
                            <Td style={{ cursor: 'pointer', minWidth: '200px' }}>
                              <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${collection.address}`}>
                                <Flex alignItems="center">
                                  <ProfileAvatar src={collection.avatar} width={48} height={48} mr="16px" />
                                  {collection.name}
                                </Flex>
                              </NextLinkFromReactRouter>
                            </Td>
                            <Td>
                              <Flex alignItems="center">
                                {volume}
                                <BnbUsdtPairTokenIcon ml="8px" />
                              </Flex>
                            </Td>
                            <Td>
                              {collection.lowestPrice ? (
                                collection.lowestPrice.toLocaleString(undefined, { maximumFractionDigits: 5 })
                              ) : (
                                <Skeleton width={36} height={20} />
                              )}
                            </Td>
                            <Td>
                              {collection.highestPrice ? (
                                collection.highestPrice.toLocaleString(undefined, { maximumFractionDigits: 5 })
                              ) : (
                                <Skeleton width={36} height={20} />
                              )}
                            </Td>
                            <Td>{collection.numberTokensListed}</Td>
                            <Td>{collection?.totalSupply}</Td>
                          </tr>
                        )
                      })
                      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)}
                  </tbody>
                </Table>
              </Card>
            ) : (
              <Grid
                gridGap="16px"
                gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
                mb="32px"
                data-test="nft-collection-row"
              >
                {sortedCollections.slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE).map((collection) => {
                  return (
                    <CollectionCard
                      key={collection.address}
                      bgSrc={collection.banner.small}
                      avatarSrc={collection.avatar}
                      collectionName={collection.name}
                      url={`${nftsBaseUrl}/collections/${collection.address}`}
                    >
                      <Flex alignItems="center">
                        <Text fontSize="12px" color="textSubtle">
                          {t('Volume')}
                        </Text>
                        <BNBAmountLabel
                          amount={collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0}
                        />
                      </Flex>
                    </CollectionCard>
                  )
                })}
              </Grid>
            )}
            <PageButtons>
              <Arrow
                onClick={() => {
                  setPage(page === 1 ? page : page - 1)
                }}
              >
                <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
              <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
              <Arrow
                onClick={() => {
                  setPage(page === maxPage ? page : page + 1)
                }}
              >
                <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
          </>
        )}
      </Page>
    </>
  )
}

export default Collectible
