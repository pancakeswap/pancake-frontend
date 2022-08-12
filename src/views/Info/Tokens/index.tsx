import { Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import { useMemo } from 'react'
import { useAllTokenData, useTokenDatas } from 'state/info/hooks'
import { useWatchlistTokens } from 'state/user/hooks'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

const TokensOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

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
      <Heading scale="lg" mt="40px" mb="16px" id="info-tokens-title">
        {t('All Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
    </Page>
  )
}

export default TokensOverview
