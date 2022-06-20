import { useEffect } from 'react'
import { Card, Heading, Table, Th, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import Container from 'components/Layout/Container'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { fetchAddressResult } from 'state/predictions'
import { useGetOrFetchLeaderboardAddressResult } from 'state/predictions/hooks'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import DesktopRow from './DesktopRow'
import MobileRow from './MobileRow'

const ConnectedWalletResult = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const accountResult = useGetOrFetchLeaderboardAddressResult(account)
  const { isDesktop } = useMatchBreakpointsContext()
  const { token } = useConfig()

  useEffect(() => {
    if (account) {
      dispatch(fetchAddressResult(account))
    }
  }, [account, dispatch])

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
                <Th textAlign="right">{t('Net Winnings (%symbol%)', { symbol: token.symbol })}</Th>
                <Th textAlign="center">{t('Win Rate')}</Th>
                <Th>{t('Rounds Won')}</Th>
                <Th>{t('Rounds Played')}</Th>
              </tr>
            </thead>
            <tbody>
              <DesktopRow user={accountResult} />
            </tbody>
          </Table>
        </Card>
      ) : (
        <Card isActive>
          <MobileRow user={accountResult} />
        </Card>
      )}
    </Container>
  )
}

export default ConnectedWalletResult
