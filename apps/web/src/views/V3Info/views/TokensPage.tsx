import { useTranslation } from '@pancakeswap/localization'
import { Heading } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useMemo } from 'react'
// import { useWatchlistTokens } from 'state/user/hooks'
import { useTopTokensData } from 'views/V3Info/hooks'
import TokenTable from '../components/TokenTable'
import TopTokenMovers from '../components/TopTokenMovers'

const TokensOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  const allTokens = useTopTokensData()

  const formattedTokens = useMemo(() => {
    if (allTokens)
      return Object.values(allTokens)
        .map((token) => token)
        .filter((token) => token)
    return []
  }, [allTokens])

  // const [savedTokens] = useWatchlistTokens()
  // const watchListTokens = useTokenDatasSWR(savedTokens)

  return (
    <Page>
      {/* <Heading scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      {watchListTokens.length > 0 ? (
        <TokenTable tokenDatas={watchListTokens} />
      ) : (
        <Card>
          <Text py="16px" px="24px">
            {t('Saved tokens will appear here')}
          </Text>
        </Card>
      )} */}
      <TopTokenMovers />
      <Heading scale="lg" mt="40px" mb="16px" id="info-tokens-title">
        {t('All Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
    </Page>
  )
}

export default TokensOverview
