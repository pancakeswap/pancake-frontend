import React from 'react'
import styled from 'styled-components'
import { Button, Card, CardBody, CardHeader, Flex, Heading, PrizeIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import AchievementRow from './AchievementRow'

const ButtonWrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 160px;
  }
`

const ClaimPointsCallout = () => {
  const TranslateString = useI18n()

  return (
    <Card isActive mb="32px">
      <CardHeader>
        <Flex flexDirection={['column', null, 'row']} justifyContent={['start', null, 'space-between']}>
          <Flex alignItems="center" mb={['16px', null, 0]}>
            <PrizeIcon width="32px" mr="8px" />
            <Heading size="lg">{TranslateString(999, `${1} Points to Collect`, { num: 1 })}</Heading>
          </Flex>
          <ButtonWrapper>
            <Button fullWidth>{TranslateString(999, 'Collect All')}</Button>
          </ButtonWrapper>
        </Flex>
      </CardHeader>
      <CardBody>
        <AchievementRow achievement={{ image: '/images/nfts/drizzle-md.png', title: 'Title' }} />
      </CardBody>
    </Card>
  )
}

export default ClaimPointsCallout
