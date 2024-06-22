import { useTranslation } from '@pancakeswap/localization'
import { Heading } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useMemo } from 'react'
import { useAllTokenDataQuery } from 'state/info/hooks'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'

const TokensOverview: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()

  const allTokens = useAllTokenDataQuery()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])

  return (
    <Page>
      <TopTokenMovers />
      <Heading scale="lg" mt="40px" mb="16px" id="info-tokens-title">
        {t('All Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
    </Page>
  )
}

export default TokensOverview
