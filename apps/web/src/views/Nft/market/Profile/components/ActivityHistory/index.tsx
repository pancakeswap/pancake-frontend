import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { isAddress } from 'utils'
import { useAppDispatch } from 'state'
import { getUserActivity } from 'state/nftMarket/helpers'
import { ArrowBackIcon, ArrowForwardIcon, Card, Flex, Table, Text, Th, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Activity, NftToken } from 'state/nftMarket/types'
import { useTranslation } from 'contexts/Localization'
import TableLoader from 'components/TableLoader'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import useTheme from 'hooks/useTheme'
import { useRouter } from 'next/router'
import { sortUserActivity } from '../../utils/sortUserActivity'
import NoNftsImage from '../../../components/Activity/NoNftsImage'
import { Arrow, PageButtons } from '../../../components/PaginationButtons'
import ActivityRow from '../../../components/Activity/ActivityRow'
import { fetchActivityNftMetadata } from '../../../ActivityHistory/utils/fetchActivityNftMetadata'

const MAX_PER_PAGE = 8

const ActivityHistory = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const accountAddress = useRouter().query.accountAddress as string
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [activitiesSlice, setActivitiesSlice] = useState<Activity[]>([])
  const [nftMetadata, setNftMetadata] = useState<NftToken[]>([])
  const [sortedUserActivities, setSortedUserActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const bnbBusdPrice = useBNBBusdPrice()
  const { isXs, isSm } = useMatchBreakpoints()

  useEffect(() => {
    const fetchAddressActivity = async () => {
      try {
        const addressActivity = await getUserActivity(accountAddress.toLocaleLowerCase())
        setSortedUserActivities(sortUserActivity(accountAddress, addressActivity))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch address activity', error)
      }
    }

    if (isAddress(accountAddress)) {
      fetchAddressActivity()
    }
  }, [account, accountAddress, dispatch])

  useEffect(() => {
    const fetchNftMetadata = async () => {
      const nfts = await fetchActivityNftMetadata(sortedUserActivities)
      setNftMetadata(nfts)
    }

    const getMaxPages = () => {
      const max = Math.ceil(sortedUserActivities.length / MAX_PER_PAGE)
      setMaxPages(max)
    }

    if (sortedUserActivities.length > 0) {
      getMaxPages()
      fetchNftMetadata()
    }

    return () => {
      setActivitiesSlice([])
      setNftMetadata([])
      setMaxPages(1)
      setCurrentPage(1)
    }
  }, [sortedUserActivities])

  useEffect(() => {
    const getActivitySlice = () => {
      const slice = sortedUserActivities.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
      setActivitiesSlice(slice)
    }
    if (sortedUserActivities.length > 0) {
      getActivitySlice()
    }
  }, [sortedUserActivities, currentPage])

  return (
    <Card style={{ overflowX: 'auto' }}>
      {sortedUserActivities.length === 0 && nftMetadata.length === 0 && activitiesSlice.length === 0 && !isLoading ? (
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
                    <Th textAlign="center"> {t('From/To')}</Th>
                  </>
                )}
                <Th textAlign="center"> {t('Date')}</Th>
                {isXs || isSm ? null : <Th />}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
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
                      isUserActivity
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
