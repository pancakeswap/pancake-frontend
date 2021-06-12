import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { CardHeader, Card, CardBody, Text, CardFooter, ArrowBackIcon, Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { fetchLottery, fetchTickets } from 'state/lottery/helpers'
import FinishedRoundTable from './FinishedRoundTable'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.xs} {
    min-width: 320px;
  }
`

const YourHistoryCard = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [viewFinishedRound, setViewFinishedRound] = useState(false)
  const [roundDetails, setRoundDetails] = useState(null)

  const handleHistoryRowClick = async (roundId) => {
    // TODO: Load in necessary lottery data. May not require fetch, as all this data is likely required for this component
    // const lottery = await fetchLottery(roundId)
    // const userTicketIds = await fetchTickets(roundId, account, 0)
    setViewFinishedRound(true)
  }

  const getHeader = () => {
    if (viewFinishedRound) {
      return (
        <Flex alignItems="center">
          <ArrowBackIcon onClick={() => setViewFinishedRound(false)} mr="20px" />
          <Flex flexDirection="column" alignItems="flex-start" justifyContent="center">
            <Heading scale="md">{t('Round')} </Heading>
            <Text>{t('Drawn')}</Text>
          </Flex>
        </Flex>
      )
    }
    return <Heading scale="md">{t('Rounds')}</Heading>
  }

  return (
    <StyledCard>
      <CardHeader>{getHeader()}</CardHeader>
      {viewFinishedRound ? (
        <CardBody>
          <div>wat</div>
        </CardBody>
      ) : (
        <>
          <CardBody>
            <FinishedRoundTable handleHistoryRowClick={handleHistoryRowClick} />
          </CardBody>
          <CardFooter>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
              <Text fontSize="12px" color="textSubtle">
                {t('Only showing data for Lottery V2')}
              </Text>
            </Flex>
          </CardFooter>
        </>
      )}
    </StyledCard>
  )
}

export default YourHistoryCard
