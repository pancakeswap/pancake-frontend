import React, { useEffect } from 'react'
import { Card, Heading, Table, Th } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import Container from 'components/Layout/Container'
import { useAppDispatch } from 'state'
import { fetchProfileAvatar } from 'state/profile'
import { fetchAccountResult } from 'state/predictions'
import { useGetLeaderboardAccountResult } from 'state/predictions/hooks'
import DesktopRow from './DesktopRow'

const ConnectedWalletResult = () => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const accountResult = useGetLeaderboardAccountResult()

  useEffect(() => {
    if (account) {
      dispatch(fetchProfileAvatar(account))
      dispatch(fetchAccountResult(account))
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
      <Card>
        <Table>
          <thead>
            <tr>
              <Th width="60px">&nbsp;</Th>
              <Th textAlign="left">&nbsp;</Th>
              <Th textAlign="right">{t('Net Winnings (BNB)')}</Th>
              <Th textAlign="center">{t('Win Rate')}</Th>
              <Th textAlign="right">{t('Rounds Won')}</Th>
            </tr>
          </thead>
          <tbody>
            <DesktopRow user={accountResult} />
          </tbody>
        </Table>
      </Card>
    </Container>
  )
}

export default ConnectedWalletResult
