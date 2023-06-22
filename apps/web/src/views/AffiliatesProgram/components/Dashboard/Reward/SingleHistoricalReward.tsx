import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useEffect, useState } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { UserClaimListResponse, MAX_PER_PAGE, ClaimDetail } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import {
  Box,
  Flex,
  Text,
  Card,
  PaginationButton,
  Table,
  Td,
  Th,
  FlexProps,
  Button,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
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
  isFetching: boolean
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
  const { chainId } = useActiveChainId()
  const { isDesktop } = useMatchBreakpoints()
  const {
    title,
    isFetching,
    tableFirstTitle,
    dataList,
    currentPage,
    isAffiliateClaim,
    setCurrentPage,
    handleClickClaim,
  } = props
  const [maxPage, setMaxPages] = useState(1)

  useEffect(() => {
    if (dataList?.total > 0) {
      const max = Math.ceil(dataList?.total / MAX_PER_PAGE)
      setMaxPages(max)
    }

    return () => {
      setMaxPages(1)
    }
  }, [dataList, setCurrentPage])

  return (
    <Flex flexDirection="column" {...props}>
      <Text color="secondary" fontSize={12} bold mb="16px">
        {title}
      </Text>
      <Card>
        <Table>
          <thead>
            <tr>
              {isDesktop ? (
                <>
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
                </>
              ) : (
                <Th>
                  <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                    {`${tableFirstTitle} /`}
                  </Text>
                  <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                    {t('Claim Request time')}
                  </Text>
                </Th>
              )}
              <Th>
                <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="right">
                  {t('State')}
                </Text>
              </Th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <Td colSpan={isDesktop ? 3 : 2} textAlign="center">
                  {t('Loading...')}
                </Td>
              </tr>
            ) : (
              <>
                {dataList?.total === 0 ? (
                  <tr>
                    <Td colSpan={isDesktop ? 3 : 2} textAlign="center">
                      {t('No results')}
                    </Td>
                  </tr>
                ) : (
                  <>
                    {dataList?.claimRequests?.map((reward) => (
                      <tr key={reward.createdAt}>
                        {isDesktop ? (
                          <>
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
                          </>
                        ) : (
                          <Td>
                            <Text>{`$${formatNumber(Number(reward.amountUSD), 0, 2)}`}</Text>
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
                        )}
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
                            <>
                              {chainId !== ChainId.BSC ? (
                                <Text color="textDisabled" textAlign="right">
                                  {t('Claim')}
                                </Text>
                              ) : (
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
                            </>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </>
                )}
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
