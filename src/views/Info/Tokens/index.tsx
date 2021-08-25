import React, { useMemo, useEffect } from 'react'
import { Text, Heading, Card } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import { useAllTokenData, useTokenDatas } from 'state/info/hooks'
import { useWatchlistTokens } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

const TokensOverview: React.FC = () => {
  const { t } = useTranslation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const allTokens = useAllTokenData()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])

  const [savedTokens] = useWatchlistTokens()
  const watchListTokens = useTokenDatas(savedTokens)

  return (
    <Page>
      <Heading scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      {savedTokens.length > 0 ? (
        <TokenTable tokenDatas={watchListTokens} />
      ) : (
        <Card>
          <Text py="16px" px="24px">
            {t('Saved tokens will appear here')}
          </Text>
        </Card>
      )}
      <TopTokenMovers />
      <Heading scale="lg" mt="40px" mb="16px">
        {t('All Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
    </Page>
  )
}

export default TokensOverview
