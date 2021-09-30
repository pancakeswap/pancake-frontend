import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { uniqBy } from 'lodash'
import { Flex, Text, Card, ArrowBackIcon, ArrowForwardIcon, Table, Th, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getNftsFromDifferentCollectionsApi } from 'state/nftMarket/helpers'
import { NftToken, TokenIdWithCollectionAddress, UserNftInitializationState } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import useTheme from 'hooks/useTheme'
import { useParams } from 'react-router'
import useFetchUserActivity from '../../hooks/useFetchUserActivity'
import useUserActivity, { Activity } from '../../hooks/useUserActivity'
import ActivityRow from './ActivityRow'
import TableLoader from './TableLoader'
import NoNftsImage from '../NoNftsImage'

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

const MAX_PER_PAGE = 8

const ActivityHistory = () => {
  const { accountAddress } = useParams<{ accountAddress: string }>()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [activitiesSlice, setActivitiesSlice] = useState<Activity[]>([])
  const [nftMetadata, setNftMetadata] = useState<NftToken[]>([])
  const { sortedUserActivities, initializationState } = useUserActivity(accountAddress)
  const bnbBusdPrice = useBNBBusdPrice()
  const { isXs, isSm } = useMatchBreakpoints()

  useFetchUserActivity(accountAddress)

  useEffect(() => {
    const fetchActivityNftMetadata = async () => {
      const activityNftTokenIds = uniqBy(
        sortedUserActivities.map((activity): TokenIdWithCollectionAddress => {
          return { tokenId: activity.nft.tokenId, collectionAddress: activity.nft.collection.id }
        }),
        'tokenId',
      )
      const nfts = await getNftsFromDifferentCollectionsApi(activityNftTokenIds)
      setNftMetadata(nfts)
    }

    const getMaxPages = () => {
      const max = Math.ceil(sortedUserActivities.length / MAX_PER_PAGE)
      setMaxPages(max)
    }

    if (sortedUserActivities.length > 0) {
      getMaxPages()
      fetchActivityNftMetadata()
    }

    return () => {
      setActivitiesSlice([])
      setNftMetadata([])
      setMaxPages(1)
      setCurrentPage(1)
    }
  }, [sortedUserActivities])

  useEffect(() => {
    const getActivitiesSlice = () => {
      const slice = sortedUserActivities.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
      setActivitiesSlice(slice)
    }
    if (sortedUserActivities.length > 0) {
      getActivitiesSlice()
    }
  }, [sortedUserActivities, currentPage])

  return (
    <Card>
      {sortedUserActivities.length === 0 &&
      nftMetadata.length === 0 &&
      activitiesSlice.length === 0 &&
      initializationState === UserNftInitializationState.INITIALIZED ? (
        <Flex p="24px" flexDirection="column" alignItems="center">
          <NoNftsImage />
          <Text pt="8px" bold>
            {t('No NFT market history found')}
          </Text>
        </Flex>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th textAlign={['center', null, 'left']}> {t('Item')}</Th>
                <Th textAlign="right"> {t('Event')}</Th>
                {isXs || isSm ? null : (
                  <>
                    <Th textAlign="right"> {t('Price')}</Th>
                    <Th textAlign="right"> {t('From/To')}</Th>
                  </>
                )}
                <Th textAlign="center"> {t('Date')}</Th>
                {isXs || isSm ? null : <Th />}
              </tr>
            </thead>

            <tbody>
              {initializationState === UserNftInitializationState.INITIALIZING ? (
                <TableLoader />
              ) : (
                activitiesSlice.map((activity) => {
                  const nftMeta = nftMetadata.find((metaNft) => metaNft.tokenId === activity.nft.tokenId)
                  return (
                    <ActivityRow
                      key={`${activity.nft.tokenId}${activity.timestamp}`}
                      activity={activity}
                      nft={nftMeta}
                      bnbBusdPrice={bnbBusdPrice}
                    />
                  )
                })
              )}
            </tbody>
          </Table>
          <Flex
            borderTop={`1px ${theme.colors.cardBorder} solid`}
            pt="24px"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
          >
            <PageButtons>
              <Arrow
                onClick={() => {
                  setCurrentPage(currentPage === 1 ? currentPage : currentPage - 1)
                }}
              >
                <ArrowBackIcon color={currentPage === 1 ? 'textDisabled' : 'primary'} />
              </Arrow>
              <Text>{t('Page %page% of %maxPage%', { page: currentPage, maxPage })}</Text>
              <Arrow
                onClick={() => {
                  setCurrentPage(currentPage === maxPage ? currentPage : currentPage + 1)
                }}
              >
                <ArrowForwardIcon color={currentPage === maxPage ? 'textDisabled' : 'primary'} />
              </Arrow>
            </PageButtons>
          </Flex>
        </>
      )}
    </Card>
  )
}

export default ActivityHistory
