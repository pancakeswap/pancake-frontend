import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { Card, Heading, Table, Th, useMatchBreakpoints } from '@pancakeswap/uikit'
import Container from 'components/Layout/Container'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useEffect } from 'react'
import { fetchAddressResult } from 'state/predictions'
import { useGetOrFetchLeaderboardAddressResult } from 'state/predictions/hooks'
import { useAccount } from 'wagmi'
import DesktopRow from './DesktopRow'
import MobileRow from './MobileRow'

interface ConnectedWalletResultProps {
  api: string
  token: Token | undefined
}

const ConnectedWalletResult: React.FC<React.PropsWithChildren<ConnectedWalletResultProps>> = ({ api, token }) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const { isDesktop } = useMatchBreakpoints()
  const accountResult = useGetOrFetchLeaderboardAddressResult({
    account: account ?? '',
    api,
    tokenSymbol: token?.symbol ?? '',
  })

  useEffect(() => {
    if (account && api && token?.symbol) {
      dispatch(fetchAddressResult({ account, api, tokenSymbol: token?.symbol, chainId: token?.chainId }))
    }
  }, [account, api, dispatch, token])

  if (!account || !accountResult) {
    return null
  }

  return (
    <Container mb="48px">
      <Heading as="h2" scale="md" color="secondary" mb="16px">
        {t('My Rankings')}
      </Heading>
      {isDesktop ? (
        <Card isActive>
          <Table>
            <thead>
              <tr>
                <Th width="60px">&nbsp;</Th>
                <Th textAlign="left">&nbsp;</Th>
                <Th textAlign="right">{t('Net Winnings (%symbol%)', { symbol: token?.symbol })}</Th>
                <Th textAlign="center">{t('Win Rate')}</Th>
                <Th>{t('Rounds Won')}</Th>
                <Th>{t('Rounds Played')}</Th>
              </tr>
            </thead>
            <tbody>
              <DesktopRow user={accountResult} api={api} token={token} />
            </tbody>
          </Table>
        </Card>
      ) : (
        <Card isActive>
          <MobileRow user={accountResult} api={api} token={token} />
        </Card>
      )}
    </Container>
  )
}

export default ConnectedWalletResult
