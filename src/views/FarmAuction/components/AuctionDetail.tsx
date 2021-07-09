import React from 'react'
import styled from 'styled-components'
import { Text, Heading, Card, CardHeader, CardBody, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const LeftCard = styled(Card)`
  flex: 1;
`

const RightCard = styled(Card)`
  flex: 2;
`

const ScheduleInner = styled(Flex)`
  flex-direction: column;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px ${({ theme }) => theme.colors.cardBorder} solid;
`

const AuctionDetail = () => {
  const { t } = useTranslation()

  return (
    <Flex width="100%" flexDirection={['column', null, null, 'row']}>
      <LeftCard mr={[null, null, null, '24px']} mb={['24px', null, null, '0']}>
        <CardHeader>
          <Heading>{t('Next Auction')}</Heading>
        </CardHeader>
        <CardBody>
          <Text fontSize="12px" bold color="secondary" textTransform="uppercase" mb="8px">
            {t('Auction Schedule')}
          </Text>
          <ScheduleInner>
            <Flex justifyContent="space-between" mb="8px">
              <Text color="textSubtle">{t('Auction duration')}</Text>
              <Text> {t('%numHours% hours', { numHours: '~24' })}</Text>
            </Flex>
            <Flex justifyContent="space-between" mb="8px">
              <Text color="textSubtle">{t('Start')}</Text>
              <Text> {t('To be announced')}</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text color="textSubtle">{t('End')}</Text>
              <Text> {t('To be announced')}</Text>
            </Flex>
          </ScheduleInner>
        </CardBody>
      </LeftCard>
      <RightCard>
        <CardHeader variant="bubblegum">
          <Heading color="#280D5F">{t('Auction Leaderboard')}</Heading>
        </CardHeader>
        <CardBody>
          <Flex minHeight="152px" flexDirection="column" alignItems="center" justifyContent="center">
            <Text bold fontSize="16px" color="primary" textAlign="center">
              {t('Coming soon!')}
            </Text>
          </Flex>
        </CardBody>
      </RightCard>
    </Flex>
  )
}

export default AuctionDetail
