import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useEffect, useState } from 'react'
import { UserClaimListResponse, MAX_PER_PAGE, ClaimDetail } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import { Box, Flex, Text, Card, PaginationButton, Table, Td, Th, FlexProps, Button } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

const Dot = styled(Box)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 8px;
  align-self: center;
  background: ${({ theme }) => theme.colors.warning};
`

interface SingleHistoricalRewardProps extends FlexProps {
  title: string
  tableFirstTitle: string
  isAffiliateClaim: boolean
  dataList: UserClaimListResponse
  currentPage: number
  setCurrentPage: (value: number) => void
  handleClickClaim: (isAffiliateClaim: boolean, reward: ClaimDetail) => Promise<void>
}

const SingleHistoricalReward: React.FC<React.PropsWithChildren<SingleHistoricalRewardProps>> = (props) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { title, tableFirstTitle, dataList, currentPage, isAffiliateClaim, setCurrentPage, handleClickClaim } = props
  const [maxPage, setMaxPages] = useState(1)
  const [list, setList] = useState<ClaimDetail[]>()

  useEffect(() => {
    if (dataList?.total > 0) {
      const max = Math.ceil(dataList?.total / MAX_PER_PAGE)
      setMaxPages(max)
    }

    return () => {
      setMaxPages(1)
      setCurrentPage(1)
      setList([])
    }
  }, [dataList, setCurrentPage])

  useEffect(() => {
    const getActivitySlice = () => {
      const slice = dataList?.claimRequests?.slice(MAX_PER_PAGE * (currentPage - 1), MAX_PER_PAGE * currentPage)
      setList(slice)
    }
    if (dataList?.claimRequests?.length > 0) {
      getActivitySlice()
    }
  }, [currentPage, dataList])

  return (
    <Flex flexDirection="column" {...props}>
      <Text color="secondary" fontSize={12} bold mb="16px">
        {title}
      </Text>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>
                <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                  {tableFirstTitle}
                </Text>
              </Th>
              <Th>
                <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                  {t('Claim Request time')}
                </Text>
              </Th>
              <Th>
                <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="right">
                  {t('State')}
                </Text>
              </Th>
            </tr>
          </thead>
          <tbody>
            {list?.length === 0 ? (
              <tr>
                <Td colSpan={3} textAlign="center">
                  {t('No results')}
                </Td>
              </tr>
            ) : (
              <>
                {list?.map((reward) => (
                  <tr key={reward.nonce}>
                    <Td>
                      <Text>{`$${formatNumber(Number(reward.amountUSD), 0, 2)}`}</Text>
                    </Td>
                    <Td>
                      <Flex>
                        <Text color="textSubtle">
                          {new Date(reward.createdAt).toLocaleString(locale, {
                            year: 'numeric',
                            month: 'numeric',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                        {reward.approveStatus === 'APPROVED' && !reward.process && <Dot />}
                      </Flex>
                    </Td>
                    <Td>
                      {reward.approveStatus === 'PENDING' && (
                        <Text color="textSubtle" textAlign="right">
                          {t('Pending Approval')}
                        </Text>
                      )}
                      {reward.approveStatus === 'REJECTED' && (
                        <Text color="failure" textAlign="right">
                          {t('Rejected')}
                        </Text>
                      )}
                      {reward.approveStatus === 'APPROVED' && reward.process && (
                        <Text color="textSubtle" textAlign="right">
                          {t('Claimed')}
                        </Text>
                      )}
                      {reward.approveStatus === 'APPROVED' && !reward.process && (
                        <Button
                          ml="auto"
                          padding="0"
                          variant="text"
                          display="block"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleClickClaim(isAffiliateClaim, reward)}
                        >
                          {t('Claim')}
                        </Button>
                      )}
                    </Td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Card>
    </Flex>
  )
}

export default SingleHistoricalReward
