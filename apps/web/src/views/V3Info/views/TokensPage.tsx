import { useTranslation } from '@pancakeswap/localization'
import { Card, Heading, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useInfoUserSavedTokensAndPoolsList from 'hooks/useInfoUserSavedTokensAndPoolsList'
import { useMemo } from 'react'
import { useChainIdByQuery } from 'state/info/hooks'
import { useTokensData, useTopTokensData } from 'views/V3Info/hooks'
import TokenTable from '../components/TokenTable'
import TopTokenMovers from '../components/TopTokenMovers'

const TokensOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  const allTokens = useTopTokensData()
  const chianId = useChainIdByQuery()
  const { savedTokens } = useInfoUserSavedTokensAndPoolsList(chianId)
  const watchListTokens = useTokensData(savedTokens)

  const formattedTokens = useMemo(() => {
    if (allTokens)
      return Object.values(allTokens)
        .map((token) => token)
        .filter((token) => token)
    return []
  }, [allTokens])

  return (
    <Page>
      <Heading scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      {watchListTokens?.length > 0 ? (
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
