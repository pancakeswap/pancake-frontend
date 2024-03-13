import { useLastUpdated } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, PaginationButton, Table, Text, Th, useMatchBreakpoints } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import TableLoader from 'components/TableLoader'
import { useBNBPrice } from 'hooks/useBNBPrice'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { getCollectionActivity } from 'state/nftMarket/helpers'
import { useGetNftActivityFilters } from 'state/nftMarket/hooks'
import { Activity, Collection, NftToken } from 'state/nftMarket/types'
import { safeGetAddress } from 'utils'
import { isAddress } from 'viem'
import ActivityRow from '../components/Activity/ActivityRow'
import NoNftsImage from '../components/Activity/NoNftsImage'
import ActivityFilters from './ActivityFilters'
import { fetchActivityNftMetadata } from './utils/fetchActivityNftMetadata'
import { sortActivity } from './utils/sortActivity'

const MAX_PER_PAGE = 8

const MAX_PER_QUERY = 100

interface ActivityHistoryProps {
  collection?: Collection
}

const ActivityHistory: React.FC<React.PropsWithChildren<ActivityHistoryProps>> = ({ collection }) => {
  const dispatch = useAppDispatch()
  const { address: collectionAddress } = collection || { address: '' }
  const nftActivityFilters = useGetNftActivityFilters(collectionAddress)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [activityData, setActivityData] = useState<Activity[]>([])
  const [activitiesSlice, setActivitiesSlice] = useState<Activity[]>([])
  const [nftMetadata, setNftMetadata] = useState<NftToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [queryPage, setQueryPage] = useState(1)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const bnbBusdPrice = useBNBPrice()
  const { isXs, isSm, isMd } = useMatchBreakpoints()

  const nftActivityFiltersString = JSON.stringify(nftActivityFilters)

  useEffect(() => {
    const fetchCollectionActivity = async () => {
      try {
        setIsLoading(true)
        const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
        const collectionActivity = await getCollectionActivity(
          collectionAddress.toLowerCase(),
          nftActivityFiltersParsed,
          MAX_PER_QUERY,
        )
        const activity = sortActivity(collectionActivity)
        setCurrentPage(1)
        setActivityData(activity)
        setMaxPages(Math.ceil(activity.length / MAX_PER_PAGE) || 1)
        setIsLoading(false)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to fetch collection activity', error)
      }
    }

    if ((collectionAddress && isAddress(collectionAddress)) || collectionAddress === '') {
      fetchCollectionActivity()
    }
  }, [dispatch, collectionAddress, nftActivityFiltersString, lastUpdated])

  useEffect(() => {
    const fetchNftMetadata = async () => {
      const nfts = await fetchActivityNftMetadata(activitiesSlice)
      setNftMetadata(nfts)
    }

    if (activitiesSlice.length > 0) {
      fetchNftMetadata()
    }
  }, [activitiesSlice])

  useEffect(() => {
    const slice = activityData.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
    setActivitiesSlice(slice)
  }, [activityData, currentPage])

  useEffect(() => {
    const fetchCollectionActivity = async () => {
      try {
        setIsLoading(true)
        const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
        const collectionActivity = await getCollectionActivity(
          collectionAddress.toLowerCase(),
          nftActivityFiltersParsed,
          MAX_PER_QUERY * (queryPage + 1),
        )
        const activity = sortActivity(collectionActivity)

        setIsLoading(false)
        setActivityData(activity)
        setMaxPages(Math.ceil(activity.length / MAX_PER_PAGE) || 1)
        setQueryPage((prevState) => prevState + 1)
      } catch (error) {
        console.error('Failed to fetch collection activity', error)
      }
    }

    if (maxPage - currentPage === 1 && activityData.length === MAX_PER_QUERY * queryPage) {
      fetchCollectionActivity()
    }
  }, [activityData, collectionAddress, currentPage, maxPage, nftActivityFiltersString, queryPage])

  const marketHistoryNotFound =
    activityData.length === 0 && nftMetadata.length === 0 && activitiesSlice.length === 0 && !isLoading

  const pagination = marketHistoryNotFound ? null : (
    <Container>
      <Flex
        borderTop={`1px ${theme.colors.cardBorder} solid`}
        pt="24px"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Flex>
    </Container>
  )

  return (
    <Box py="32px">
      <Container px={[0, null, '24px']}>
        <Flex
          style={{ gap: '16px', padding: '0 16px' }}
          alignItems={[null, null, 'center']}
          flexDirection={['column', 'column', 'row']}
          flexWrap={isMd ? 'wrap' : 'nowrap'}
        >
          <ActivityFilters address={collection?.address || ''} nftActivityFilters={nftActivityFilters} />
          <Button
            scale="sm"
            disabled={isLoading}
            onClick={() => {
              refresh()
            }}
            {...(isMd && { width: '100%' })}
          >
            {t('Refresh')}
          </Button>
        </Flex>
      </Container>
      <Container style={{ overflowX: 'auto' }}>
        {marketHistoryNotFound ? (
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
                      <Th textAlign="center"> {t('From')}</Th>
                      <Th textAlign="center"> {t('To')}</Th>
                    </>
                  )}
                  <Th textAlign="center"> {t('Date')}</Th>
                  {isXs || isSm ? null : <Th />}
                </tr>
              </thead>

              <tbody>
                {!isInitialized ? (
                  <TableLoader />
                ) : (
                  activitiesSlice.map((activity) => {
                    const nftMeta = nftMetadata.find(
                      (metaNft) =>
                        metaNft.tokenId === activity.nft?.tokenId &&
                        safeGetAddress(metaNft.collectionAddress) === safeGetAddress(activity.nft?.collection.id),
                    )
                    return (
                      <ActivityRow
                        key={`${activity.marketEvent}#${activity.nft?.tokenId}#${activity.timestamp}#${activity.tx}`}
                        activity={activity}
                        nft={nftMeta}
                        bnbBusdPrice={bnbBusdPrice}
                      />
                    )
                  })
                )}
              </tbody>
            </Table>
          </>
        )}
      </Container>
      {pagination}
    </Box>
  )
}

export default ActivityHistory
