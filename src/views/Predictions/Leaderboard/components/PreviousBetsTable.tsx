import React, { useEffect, useState } from 'react'
import times from 'lodash/times'
import { Box, Card, Skeleton, Table, Td, Th } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBetHistory, transformBetResponse } from 'state/predictions/helpers'
import { Bet } from 'state/types'
import PositionLabel from './PositionLabel'
import { NetWinnings } from './Results/styles'

interface PreviousBetsTableProps {
  numberOfBets?: number
  account: string
}

const PreviousBetsTable: React.FC<PreviousBetsTableProps> = ({ numberOfBets = 5, account }) => {
  const [isFetching, setIsFetching] = useState(false)
  const [bets, setBets] = useState<Bet[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const fetchBetHistory = async () => {
      setIsFetching(true)
      try {
        const response = await getBetHistory(
          {
            user: account.toLowerCase(),
          },
          numberOfBets,
        )

        setBets(response.map(transformBetResponse))
      } finally {
        setIsFetching(false)
      }
    }

    fetchBetHistory()
  }, [account, numberOfBets, setIsFetching, setBets])

  return (
    <Box p={[0, null, null, null, '24px']}>
      <Card>
        <Table>
          <thead>
            <tr>
              <Th>{t('Round')}</Th>
              <Th>{t('Direction')}</Th>
              <Th textAlign="right">{t('Winnings (BNB)')}</Th>
            </tr>
          </thead>
          <tbody>
            {isFetching
              ? times(numberOfBets).map((num) => (
                  <tr key={num}>
                    <Td>
                      <Skeleton width="80px" />
                    </Td>
                    <Td>
                      <Skeleton width="60px" height="32px" />
                    </Td>
                    <Td>
                      <Skeleton width="80px" />
                    </Td>
                  </tr>
                ))
              : bets.map((bet) => (
                  <tr key={bet.id}>
                    <Td textAlign="center" fontWeight="bold">
                      {bet.round.epoch.toLocaleString()}
                    </Td>
                    <Td textAlign="center">
                      <PositionLabel position={bet.position} />
                    </Td>
                    <Td textAlign="right">
                      <NetWinnings
                        amount={bet.amount}
                        textColor={bet.position === bet.round.position ? 'success' : 'failure'}
                        textPrefix={bet.position === bet.round.position ? '+' : '-'}
                      />
                    </Td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </Card>
    </Box>
  )
}

export default PreviousBetsTable
