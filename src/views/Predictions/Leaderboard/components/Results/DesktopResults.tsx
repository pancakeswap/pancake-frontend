import React from 'react'
import styled from 'styled-components'
import { BunnyPlaceholderIcon, Card, Flex, Link, Table, Text } from '@pancakeswap/uikit'
import { PredictionUser } from 'state/types'
import Container from 'components/Layout/Container'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import truncateWalletAddress from 'utils/truncateWalletAddress'
import { NetWinnings } from './styles'

interface DesktopResultsProps {
  results: PredictionUser[]
}

const StyledTable = styled(Table)`
  th,
  td {
    vertical-align: middle;
  }

  .text-left {
    text-align: left;
  }
  .text-center {
    text-align: center;
  }
  .text-right {
    text-align: right;
  }

  .rank {
    width: 60px;
  }
`

const DesktopResults: React.FC<DesktopResultsProps> = ({ results }) => {
  const { t } = useTranslation()

  return (
    <Container mb="40px">
      <Card>
        <StyledTable>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th className="text-left">{t('User')}</th>
              <th className="text-right">{t('Net Winnings (BNB)')}</th>
              <th>{t('Win Rate')}</th>
              <th className="text-right">{t('Rounds Won')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={result.id}>
                <td className="rank">
                  <Text textAlign="center" fontWeight="bold" color="secondary">{`#${index + 4}`}</Text>
                </td>
                <td>
                  <Flex alignItems="center">
                    <BunnyPlaceholderIcon width="40px" mr="8px" />
                    <Link href={getBscScanLink(result.id, 'address')} external>
                      {truncateWalletAddress(result.id)}
                    </Link>
                  </Flex>
                </td>
                <td>
                  <NetWinnings amount={result.netBNB} />
                </td>
                <td className="text-center">
                  {`${result.winRate.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}%`}
                </td>
                <td className="text-right">{`${result.totalBetsClaimed.toLocaleString()}/${result.totalBets.toLocaleString()}`}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </Card>
    </Container>
  )
}

export default DesktopResults
