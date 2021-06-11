import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, Flex, Heading, Text, Skeleton, Button, useModal, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useLottery } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import ViewTicketsModal from './ViewTicketsModal'
import BuyTicketsButton from './BuyTicketsButton'

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-template-columns: auto 1fr;
  }
`

const DrawInfoCard = () => {
  const { t } = useTranslation()
  const {
    currentLotteryId,
    currentRound: { endTime, amountCollectedInCake, userData, status },
  } = useLottery()
  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} />)

  // TODO: Re-enebale in prod
  //   const cakePriceBusd = usePriceCakeBusd()
  const cakePriceBusd = new BigNumber(20)
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const isLotteryOpen = status === LotteryStatus.OPEN
  const userTicketCount = userData?.tickets?.length || 0

  return (
    <Card>
      <CardHeader p="16px 24px">
        <Flex justifyContent="space-between">
          <Heading>{t('Next Draw')}</Heading>
          <Text>
            {currentLotteryId && `#${currentLotteryId} | `}{' '}
            {Boolean(endTime) && `${t('Draw')}: ${endDate.toLocaleString()}`}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Grid>
          <Flex justifyContent={['center', null, null, 'flex-start']}>
            <Heading>{t('Prize Pot')}</Heading>
          </Flex>
          <Flex flexDirection="column" mb="18px">
            {prizeInBusd.isNaN() ? (
              <Skeleton my="7px" height={40} width={160} />
            ) : (
              <Balance
                fontSize="40px"
                color="secondary"
                textAlign={['center', null, null, 'left']}
                lineHeight="1"
                bold
                prefix="~$"
                value={getBalanceNumber(prizeInBusd)}
                decimals={0}
              />
            )}
            {prizeInBusd.isNaN() ? (
              <Skeleton my="2px" height={14} width={90} />
            ) : (
              <Balance
                fontSize="14px"
                color="textSubtle"
                textAlign={['center', null, null, 'left']}
                unit=" CAKE"
                value={getBalanceNumber(amountCollectedInCake)}
                decimals={0}
              />
            )}
          </Flex>
          <Box display={['none', null, null, 'flex']}>
            <Heading>{t('Your tickets')}</Heading>
          </Box>
          <Flex flexDirection={['column', null, null, 'row']}>
            {isLotteryOpen && (
              <Flex
                flexDirection="column"
                mr={[null, null, null, '24px']}
                alignItems={['center', null, null, 'flex-start']}
              >
                <Flex justifyContent={['center', null, null, 'flex-start']}>
                  <Text display="inline">{t('You have')} </Text>
                  {!userData.isLoading ? (
                    <Text display="inline" bold mx="4px">
                      {userTicketCount} {t('tickets')}
                    </Text>
                  ) : (
                    <Skeleton mx="4px" height={20} width={40} />
                  )}
                  <Text display="inline"> {t('this round')}</Text>
                </Flex>
                {!userData.isLoading && userTicketCount > 0 && (
                  <Button
                    onClick={onPresentViewTicketsModal}
                    height="auto"
                    width="fit-content"
                    p="0"
                    mb={['32px', null, null, '0']}
                    variant="text"
                    scale="sm"
                  >
                    {t('View your tickets')}
                  </Button>
                )}
              </Flex>
            )}
            <BuyTicketsButton />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default DrawInfoCard
