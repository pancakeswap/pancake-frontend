import { useEffect, useState } from 'react'
import times from 'lodash/times'
import orderBy from 'lodash/orderBy'
import { Skeleton, Table, Td, Th } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { getBetHistory, transformBetResponse } from 'state/predictions/helpers'
import { Bet } from 'state/types'
import PositionLabel from './PositionLabel'
import { NetWinningsView } from './Results/styles'

interface PreviousBetsTableProps {
  numberOfBets?: number
  account: string
  token: Token
  api: string
}

const PreviousBetsTable: React.FC<PreviousBetsTableProps> = ({ numberOfBets = 5, account, token, api }) => {
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
          undefined,
          api,
        )

        setBets(response.map(transformBetResponse))
      } finally {
        setIsFetching(false)
      }
    }

    fetchBetHistory()
  }, [account, numberOfBets, setIsFetching, setBets, api])

  return (
    <Table>
      <thead>
        <tr>
          <Th>{t('Round')}</Th>
          <Th>{t('Direction')}</Th>
          <Th textAlign="right">{t('Winnings (%symbol%)', { symbol: token.symbol })}</Th>
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
              const isCancelled = bet.round.failed
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
                    <NetWinningsView
                      token={token}
                      amount={!isCancelled && isWinner ? bet.claimedNetBNB : bet.amount}
                      textPrefix={isCancelled ? '' : isWinner ? '+' : '-'}
                      textColor={isCancelled ? 'textSubtle' : isWinner ? 'success' : 'failure'}
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
