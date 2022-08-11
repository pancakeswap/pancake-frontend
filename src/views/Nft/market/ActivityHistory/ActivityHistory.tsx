import { useEffect, useState } from 'react'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  Box,
  Button,
  Flex,
  Table,
  Text,
  Th,
  useMatchBreakpointsContext,
} from '@pancakeswap/uikit'
import { getCollectionActivity } from 'state/nftMarket/helpers'
import Container from 'components/Layout/Container'
import TableLoader from 'components/TableLoader'
import { Activity, Collection, NftToken } from 'state/nftMarket/types'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import useTheme from 'hooks/useTheme'
import { useLastUpdated } from '@pancakeswap/hooks'
import { useGetNftActivityFilters } from 'state/nftMarket/hooks'
import { Arrow, PageButtons } from '../components/PaginationButtons'
import NoNftsImage from '../components/Activity/NoNftsImage'
import ActivityFilters from './ActivityFilters'
import ActivityRow from '../components/Activity/ActivityRow'
import { sortActivity } from './utils/sortActivity'
import { fetchActivityNftMetadata } from './utils/fetchActivityNftMetadata'

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
  const [paginationData, setPaginationData] = useState<{
    activity: Activity[]
    currentPage: number
    maxPage: number
  }>({
    activity: [],
    currentPage: 1,
    maxPage: 1,
  })
  const [activitiesSlice, setActivitiesSlice] = useState<Activity[]>([])
  const [nftMetadata, setNftMetadata] = useState<NftToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [queryPage, setQueryPage] = useState(1)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()
  const bnbBusdPrice = useBNBBusdPrice()
  const { isXs, isSm, isMd } = useMatchBreakpointsContext()

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
        setPaginationData({
          activity,
          currentPage: 1,
          maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
        })
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
    const slice = paginationData.activity.slice(
      MAX_PER_PAGE * (paginationData.currentPage - 1),
      MAX_PER_PAGE * paginationData.currentPage,
    )
    setActivitiesSlice(slice)
  }, [paginationData])

  return (
    <Box py="32px">
      <Container px={[0, null, '24px']}>
        <Flex
          style={{ gap: '16px', padding: '0 16px' }}
          alignItems={[null, null, 'center']}
          flexDirection={['column', 'column', 'row']}
          flexWrap={isMd ? 'wrap' : 'nowrap'}
        >
          <ActivityFilters address={collection?.address || ''} />
          <Button
            scale="sm"
            disabled={isLoading}
            onClick={() => {
              refresh()
            }}
            width={isMd && '100%'}
          >
            {t('Refresh')}
          </Button>
        </Flex>
      </Container>
      <Container style={{ overflowX: 'auto' }}>
        {paginationData.activity.length === 0 &&
        nftMetadata.length === 0 &&
        activitiesSlice.length === 0 &&
        !isLoading ? (
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
                        metaNft.tokenId === activity.nft.tokenId &&
                        metaNft.collectionAddress.toLowerCase() === activity.nft?.collection.id.toLowerCase(),
                    )
                    return (
                      <ActivityRow
                        key={`${activity.marketEvent}#${activity.nft.tokenId}#${activity.timestamp}#${activity.tx}`}
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
                    if (paginationData.currentPage !== 1) {
                      setPaginationData((prevState) => ({
                        ...prevState,
                        currentPage: prevState.currentPage - 1,
                      }))
                    }
                  }}
                >
                  <ArrowBackIcon color={paginationData.currentPage === 1 ? 'textDisabled' : 'primary'} />
                </Arrow>
                <Text>
                  {t('Page %page% of %maxPage%', {
                    page: paginationData.currentPage,
                    maxPage: paginationData.maxPage,
                  })}
                </Text>
                <Arrow
                  onClick={async () => {
                    if (paginationData.currentPage !== paginationData.maxPage) {
                      setPaginationData((prevState) => ({
                        ...prevState,
                        currentPage: prevState.currentPage + 1,
                      }))

                      if (
                        paginationData.maxPage - paginationData.currentPage === 1 &&
                        paginationData.activity.length === MAX_PER_QUERY * queryPage
                      ) {
                        try {
                          setIsLoading(true)
                          const nftActivityFiltersParsed = JSON.parse(nftActivityFiltersString)
                          const collectionActivity = await getCollectionActivity(
                            collectionAddress.toLowerCase(),
                            nftActivityFiltersParsed,
                            MAX_PER_QUERY * (queryPage + 1),
                          )
                          const activity = sortActivity(collectionActivity)
                          setPaginationData((prevState) => {
                            return {
                              ...prevState,
                              activity,
                              maxPage: Math.ceil(activity.length / MAX_PER_PAGE) || 1,
                            }
                          })
                          setIsLoading(false)
                          setQueryPage((prevState) => prevState + 1)
                        } catch (error) {
                          console.error('Failed to fetch collection activity', error)
                        }
                      }
                    }
                  }}
                >
                  <ArrowForwardIcon
                    color={paginationData.currentPage === paginationData.maxPage ? 'textDisabled' : 'primary'}
                  />
                </Arrow>
              </PageButtons>
            </Flex>
          </>
        )}
      </Container>
    </Box>
  )
}

export default ActivityHistory
