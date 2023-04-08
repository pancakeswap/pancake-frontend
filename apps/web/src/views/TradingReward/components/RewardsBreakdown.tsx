import { useState } from 'react'
import { Card, Table, Th, Td, Text, Flex, PaginationButton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const RewardsBreakdown = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [maxPage, setMaxPages] = useState(1)
  const { isDesktop } = useMatchBreakpoints()

  return (
    <Flex
      id="rewards-breakdown"
      flexDirection="column"
      padding="0 16px"
      margin={['72px auto', '72px auto', '72px auto', '108px auto 56px auto']}
      width={['100%', '100%', '100%', '100%', '100%', '100%', '1140px']}
    >
      <Text lineHeight="110%" textAlign="center" color="secondary" mb="16px" bold fontSize={['40px']}>
        {t('Rewards Breakdown')}
      </Text>
      <Text textAlign="center" color="textSubtle" bold>
        March 20, 2023 - March 26, 2023
      </Text>
      <Text textAlign="center" color="textSubtle" mb="40px">
        Round 23 (current period)
      </Text>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th textAlign={['left']}> {t('Trading Pair')}</Th>
              {isDesktop ? (
                <>
                  <Th textAlign={['left']}> {t('Your Volume')}</Th>
                  <Th textAlign={['left']}> {t('Reward Earned')}</Th>
                  <Th textAlign={['center']}> {t('Total Volume')}</Th>
                  <Th textAlign={['right']}> {t('Total reward')}</Th>
                </>
              ) : (
                <>
                  <Th textAlign={['right']}> {t('Your Vol. /Reward Earned')}</Th>
                  <Th textAlign={['right']}> {t('Total Vol./Total reward')}</Th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>BNB-CAKE</Td>
              {isDesktop ? (
                <>
                  <Td>$499.42</Td>
                  <Td>$32.13</Td>
                  <Td textAlign="center">$123,456,789</Td>
                  <Td textAlign="right">$30,000.00</Td>
                </>
              ) : (
                <>
                  <Td>
                    <Text textAlign="right">$499.42</Text>
                    <Text textAlign="right" color="textSubtle">
                      $32.13
                    </Text>
                  </Td>
                  <Td>
                    <Text textAlign="right">$123,456,789</Text>
                    <Text textAlign="right" color="textSubtle">
                      $30,000.00
                    </Text>
                  </Td>
                </>
              )}
            </tr>
          </tbody>
        </Table>
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Card>
    </Flex>
  )
}

export default RewardsBreakdown
