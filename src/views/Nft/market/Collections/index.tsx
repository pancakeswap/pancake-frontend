import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Table,
  Th,
  Td,
  Card,
  Flex,
  BnbUsdtPairTokenIcon,
  Heading,
  useMatchBreakpoints,
  ProfileAvatar,
  ArrowBackIcon,
  Text,
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useGetCollections } from 'state/nftMarket/hooks'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export const ITEMS_PER_PAGE = 10

const SORT_FIELD = {
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
  const collections = useGetCollections()
  const { isMobile } = useMatchBreakpoints()
  const [sortField, setSortField] = useState(null)
  const [sortDirection, setSortDirection] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    setTimeout(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })
    }, 50)
  }, [page])

  useEffect(() => {
    let extraPages = 1
    const collectionValues = collections ? Object.values(collections) : []
    if (collectionValues.length % ITEMS_PER_PAGE === 0) {
      extraPages = 0
    }
    setMaxPage(Math.floor(collectionValues.length / ITEMS_PER_PAGE) + extraPages)
  }, [collections])

  const sortedCollections = useMemo(() => {
    const collectionValues = collections ? Object.values(collections) : []

    return collectionValues
      .sort((a, b) => {
        if (sortField && a && b) {
          return parseFloat(a[sortField]) > parseFloat(b[sortField])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1
        }
        return -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
  }, [page, collections, sortDirection, sortField])

  const handleSort = useCallback(
    (newField: string) => {
      setSortField(newField)
      setSortDirection(sortField !== newField ? true : !sortDirection)
    },
    [sortDirection, sortField],
  )

  const arrow = useCallback(
    (field: string) => {
      const directionArrow = !sortDirection ? '↑' : '↓'
      return sortField === field ? directionArrow : ''
    },
    [sortDirection, sortField],
  )

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" data-test="nft-collections-title">
          {t('Collections')}
        </Heading>
      </PageHeader>
      <Page>
        <Card>
          <Table>
            <thead>
              <tr>
                <Th textAlign="left">{t('Collection')}</Th>
                <Th textAlign="left" style={{ cursor: 'pointer' }} onClick={() => handleSort(SORT_FIELD.volumeBNB)}>
                  {t('Volume')}
                  {arrow(SORT_FIELD.volumeBNB)}
                </Th>
                {!isMobile && (
                  <>
                    <Th textAlign="left" style={{ cursor: 'pointer' }} onClick={() => handleSort(SORT_FIELD.items)}>
                      {t('Items')}
                      {arrow(SORT_FIELD.items)}
                    </Th>
                    <Th textAlign="left" style={{ cursor: 'pointer' }} onClick={() => handleSort(SORT_FIELD.supply)}>
                      {t('Supply')}
                      {arrow(SORT_FIELD.supply)}
                    </Th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedCollections.map((collection) => {
                const volume = collection.totalVolumeBNB
                  ? parseFloat(collection.totalVolumeBNB).toLocaleString(undefined, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })
                  : '0'
                return (
                  <tr key={collection.address} data-test="nft-collection-row">
                    <Td>
                      <Link to={`${nftsBaseUrl}/collections/${collection.address}`}>
                        <Flex alignItems="center">
                          <ProfileAvatar src={collection.avatar} width={48} height={48} mr="16px" />
                          {collection.name}
                        </Flex>
                      </Link>
                    </Td>
                    <Td>
                      <Flex alignItems="center">
                        {volume}
                        <BnbUsdtPairTokenIcon ml="8px" />
                      </Flex>
                    </Td>
                    {!isMobile && (
                      <>
                        <Td>{collection.numberTokensListed}</Td>
                        <Td>{collection.totalSupply}</Td>
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </Table>
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
        </Card>
      </Page>
    </>
  )
}

export default Collectible
