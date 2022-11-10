import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { useWeb3React } from '@pancakeswap/wagmi'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Card, Flex, Heading } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useAllTokenDataSWR } from 'state/info/hooks'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import Page from 'components/Layout/Page'


const Home: React.FC<React.PropsWithChildren> = () => {

  const { t } = useTranslation()

  const allTokens = useAllTokenDataSWR()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token.name !== 'unknown')
  }, [allTokens])

  return (
    <Page>
      <Heading scale="lg" mt="40px" mb="16px">
      {t('Top Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />

    </Page>
  )
}

export default Home
