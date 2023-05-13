import { useMemo } from 'react'
import { Flex, Text, Card, Table, Td, Th } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { ListType } from 'views/AffiliatesProgram/hooks/useLeaderboard'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

interface LeaderBoardListProps {
  isFetching: boolean
  list: ListType[]
}

const SPLICE_NUMBER = 3

const LeaderBoardList: React.FC<React.PropsWithChildren<LeaderBoardListProps>> = ({ list, isFetching }) => {
  const { t } = useTranslation()
  const otherData = useMemo(() => list.slice(SPLICE_NUMBER), [list])

  return (
    <Flex maxWidth={1120} padding="0 16px" margin="auto auto 100px auto">
      <Card style={{ width: '100%' }}>
        <Table>
          <thead>
            <Th width="5%" />
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('Affiliate')}
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('New Users')}
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('Total Volume')}
              </Text>
            </Th>
            {/* <Th width="15%">
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('Commission')}
              </Text>
            </Th> */}
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <Td colSpan={5} textAlign="center">
                  {t('Loading...')}
                </Td>
              </tr>
            ) : (
              <>
                {otherData.map((data, index) => (
                  <tr key={data.address}>
                    <Td>
                      <Text color="secondary" bold>
                        {`#${index + SPLICE_NUMBER + 1}`}
                      </Text>
                    </Td>
                    <Td>
                      <Text color="primary" bold>
                        {truncateHash(data.address)}
                      </Text>
                    </Td>
                    <Td>
                      <Text bold>{data.metric.totalUsers}</Text>
                    </Td>
                    <Td>
                      <Text bold>{`$${formatNumber(Number(data.metric.totalTradeVolumeUSD), 0)}`}</Text>
                    </Td>
                    {/* <Td>
                      <Flex flexDirection="column">
                        <Text bold>{`~ ${formatNumber(Number(data.cakeBalance), 0)} CAKE`}</Text>
                        <Text textAlign="left" fontSize="12px" color="textSubtle">
                          {`$${formatNumber(Number(data.metric.totalEarnFeeUSD), 0)}`}
                        </Text>
                      </Flex>
                    </Td> */}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>
      </Card>
    </Flex>
  )
}

export default LeaderBoardList
