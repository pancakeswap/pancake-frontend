import React, { useEffect, useState } from 'react'
import times from 'lodash/times'
import orderBy from 'lodash/orderBy'
import { Skeleton, Table, Td, Th } from '@pancakeswap/uikit'
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
  const orderedBets = orderBy(bets, ['round.epoch'], ['desc'])

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
          : orderedBets.map((bet) => {
              const isWinner = bet.position === bet.round.position

              return (
                <tr key={bet.id}>
                  <Td textAlign="center" fontWeight="bold">
                    {bet.round.epoch.toLocaleString()}
                  </Td>
                  <Td textAlign="center">
                    <PositionLabel position={bet.position} />
                  </Td>
                  <Td textAlign="right">
                    <NetWinnings
                      amount={isWinner ? bet.claimedNetBNB : bet.amount}
                      textPrefix={isWinner ? '+' : '-'}
                      textColor={isWinner ? 'success' : 'failure'}
                    />
                  </Td>
                </tr>
              )
            })}
      </tbody>
    </Table>
  )
}

export default PreviousBetsTable
