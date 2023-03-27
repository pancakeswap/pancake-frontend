import { useState } from 'react'
import styled from 'styled-components'
import { Card, Table, Th, Td, Text, Flex, PaginationButton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const RewardsBreakdown = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)

  return (
    <Flex flexDirection="column" width={['1140px']} padding="0 16px" margin="108px auto 56px auto">
      <Text textAlign="center" color="secondary" mb="16px" bold fontSize={['40px']}>
        {t('Rewards Breakdown')}
      </Text>
      <Text textAlign="center" color="textSubtle" bold mb="40px">
        March 20, 2023 - March 26, 2023
      </Text>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th textAlign={['left']}> {t('Trading Pair')}</Th>
              <Th textAlign={['left']}> {t('Your Volume')}</Th>
              <Th textAlign={['left']}> {t('Reward Earned')}</Th>
              <Th textAlign={['center']}> {t('Total Volume')}</Th>
              <Th textAlign={['right']}> {t('Total reward')}</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>BNB-CAKE</Td>
              <Td>$499.42</Td>
              <Td>$32.13</Td>
              <Td textAlign="center">$123,456,789</Td>
              <Td textAlign="right">$30,000.00</Td>
            </tr>
          </tbody>
        </Table>
        <PaginationButton currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Card>
    </Flex>
  )
}

export default RewardsBreakdown
