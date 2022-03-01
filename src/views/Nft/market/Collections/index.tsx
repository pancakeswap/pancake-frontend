import { useEffect, useMemo, useState } from 'react'
import { ArrowBackIcon, ArrowForwardIcon, Flex, Grid, Heading, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { FetchStatus } from 'config/constants/types'
import { useGetShuffledCollections } from 'state/nftMarket/hooks'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import PageLoader from 'components/Loader/PageLoader'
import { CollectionCard } from '../components/CollectibleCard'
import { BNBAmountLabel } from '../components/CollectibleCard/styles'

export const ITEMS_PER_PAGE = 9

const SORT_FIELD = {
  createdAt: 'createdAt',
  volumeBNB: 'totalVolumeBNB',
  items: 'numberTokensListed',
  supply: 'totalSupply',
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

const Collectible = () => {
  const { t } = useTranslation()
  const { data: collections, status } = useGetShuffledCollections()
  const { isMobile } = useMatchBreakpoints()
  const [sortField, setSortField] = useState(null)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

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
    const collectionValues = collections ? Object.values(collections) : []
    if (collectionValues.length % ITEMS_PER_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.max(Math.floor(collectionValues.length / ITEMS_PER_PAGE) + extraPages, 1))
  }, [collections])

  const sortedCollections = useMemo(() => {
    const collectionValues = collections ? Object.values(collections) : []

    return collectionValues.sort((a, b) => {
      if (a && b) {
        if (sortField === SORT_FIELD.createdAt) {
          if (a.createdAt && b.createdAt) {
            return Date.parse(a.createdAt) - Date.parse(b.createdAt) ? -1 : 1
          }
          return -1
        }
        return parseFloat(a[sortField]) > parseFloat(b[sortField]) ? -1 : 1
      }
      return -1
    })
  }, [collections, sortField])

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortField(option.value)
  }

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
              justifyContent={['flex-start', null, 'flex-end']}
              pr={[null, null, '4px']}
              pl={['4px', null, '0']}
              mb="8px"
            >
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
                  ]}
                  placeHolderText={t('Select')}
                  onOptionChange={handleSortOptionChange}
                />
              </Flex>
            </Flex>
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
                      <BNBAmountLabel amount={collection.totalVolumeBNB ? parseFloat(collection.totalVolumeBNB) : 0} />
                    </Flex>
                  </CollectionCard>
                )
              })}
            </Grid>
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
