import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useEffect, useState } from 'react'
import { Box, Flex, Text, Card, PaginationButton, Table, Td, Th, FlexProps } from '@pancakeswap/uikit'

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
}

const SingleHistoricalReward: React.FC<React.PropsWithChildren<SingleHistoricalRewardProps>> = (props) => {
  const { t } = useTranslation()
  const { title, tableFirstTitle } = props
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)

  return (
    <Flex flexDirection="column" {...props}>
      <Text color="secondary" fontSize={12} bold mb="16px">
        {title}
      </Text>
      <Card>
        <Table>
          <thead>
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
          </thead>
          <tbody>
            <tr>
              <Td>
                <Text>$12</Text>
              </Td>
              <Td>
                <Flex>
                  <Text color="textSubtle">HH:MM, 3rd May, 2023</Text>
                  <Dot />
                </Flex>
              </Td>
              <Td>
                <Text color="textSubtle" textAlign="right">
                  {t('Pending Approval')}
                </Text>
                {/* <Text color="textSubtle" textAlign="right">
                  {t('Claimed')}
                </Text>
                <Text style={{ cursor: 'pointer' }} color="primary" bold textAlign="right">
                  {t('Claim ')}
                </Text> */}
              </Td>
            </tr>
          </tbody>
        </Table>
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Card>
    </Flex>
  )
}

export default SingleHistoricalReward
