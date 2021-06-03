import React from 'react'
import styled from 'styled-components'
import { Card, CardHeader, CardBody, Flex, Heading, Text, Skeleton, Button, useModal, Box } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { useLottery, usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import BuyTicketsModal from './BuyTicketsModal'
import ViewTicketsModal from './ViewTicketsModal'

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
    currentRound: { endTime, amountCollectedInCake, userData },
  } = useLottery()
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal />)
  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} />)

  // TODO: Re-enebale in prod
  //   const cakePriceBusd = usePriceCakeBusd()
  const cakePriceBusd = new BigNumber(20.55)
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const endDate = new Date(parseInt(endTime, 10) * 1000)

  const userTicketCount = userData?.tickets?.length || 0

  return (
    <Card>
      <CardHeader p="16px 24px">
        <Flex justifyContent="space-between">
          <Heading>{t('Next Draw')}</Heading>
          <Text>
            #{currentLotteryId} | {endDate.toLocaleString()}
          </Text>
        </Flex>
      </CardHeader>
      <CardBody>
        <Grid>
          <Flex justifyContent={['center', null, null, 'flex-start']}>
            <Heading>{t('Prize Pot')}</Heading>
          </Flex>
          <Flex flexDirection="column" mb="18px">
            {prizeInBusd.gt(0) ? (
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
            ) : (
              <Skeleton my="7px" height={40} width={160} />
            )}
            {prizeInBusd.gt(0) ? (
              <Balance
                fontSize="14px"
                color="textSubtle"
                textAlign={['center', null, null, 'left']}
                unit=" CAKE"
                value={getBalanceNumber(amountCollectedInCake)}
                decimals={0}
              />
            ) : (
              <Skeleton my="2px" height={14} width={90} />
            )}
          </Flex>
          <Box display={['none', null, null, 'flex']}>
            <Heading>{t('Your tickets')}</Heading>
          </Box>
          <Flex flexDirection={['column', null, null, 'row']}>
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
            <Button onClick={onPresentBuyTicketsModal}>{t('Buy Tickets')}</Button>
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default DrawInfoCard
