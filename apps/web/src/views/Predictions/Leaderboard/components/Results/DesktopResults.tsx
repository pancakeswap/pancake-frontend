import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { Card, Table, Th } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import { PredictionUser } from 'state/types'
import DesktopRow from './DesktopRow'

interface DesktopResultsProps {
  results: PredictionUser[]
  api: string
  token: Token | undefined
}

const DesktopResults: React.FC<React.PropsWithChildren<DesktopResultsProps>> = ({ results, api, token }) => {
  const { t } = useTranslation()

  return (
    <Container mb="24px">
      <Card>
        <Table>
          <thead>
            <tr>
              <Th width="60px">&nbsp;</Th>
              <Th textAlign="left">{t('User')}</Th>
              <Th textAlign="right">{t('Net Winnings (%symbol%)', { symbol: token?.symbol })}</Th>
              <Th>{t('Win Rate')}</Th>
              <Th>{t('Rounds Won')}</Th>
              <Th>{t('Rounds Played')}</Th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <DesktopRow key={result.id} rank={index + 4} user={result} token={token} api={api} />
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  )
}

export default DesktopResults
