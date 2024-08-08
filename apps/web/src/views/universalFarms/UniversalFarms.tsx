import styled from 'styled-components'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { Card, Tab, TabMenu } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { PropsWithChildren, useMemo } from 'react'
import { PoolsBanner } from './components'
import { PoolsPage } from './PoolsPage'
import { PositionPage } from './PositionPage'

const StyledTab = styled(Tab)`
  padding: 0;
  & > a {
    padding: 8px;
  }
`

const PAGES_INDEX = {
  POOLS: 0,
  POSITIONS: 1,
  HISTORY: 2,
}

export const UniversalFarms: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()

  const tabIdx = useMemo(() => {
    switch (router.pathname) {
      case '/liquidity/pools':
        return PAGES_INDEX.POOLS
      case '/liquidity/positions':
        return PAGES_INDEX.POSITIONS
      default:
        return PAGES_INDEX.POOLS
    }
  }, [router.pathname])

  const tabsConfig = useMemo(() => {
    return {
      0: {
        menu: () => (
          <StyledTab key="pools">
            <NextLinkFromReactRouter to="/liquidity/pools">{t('All Pools')}</NextLinkFromReactRouter>
          </StyledTab>
        ),
        page: () => <PoolsPage />,
      },
      1: {
        menu: () => (
          <StyledTab key="positions">
            <NextLinkFromReactRouter to="/liquidity/positions">{t('My Positions')}</NextLinkFromReactRouter>
          </StyledTab>
        ),
        page: () => <PositionPage />,
      },
      2: {
        menu: () => (
          <StyledTab key="history">
            <NextLinkFromReactRouter to="/farms/history">{t('History')}</NextLinkFromReactRouter>
          </StyledTab>
        ),
        page: () => <Card>History</Card>,
      },
    }
  }, [t])

  return (
    <>
      <PoolsBanner />
      <Page>
        <TabMenu gap="8px" activeIndex={tabIdx} isShowBorderBottom={false}>
          {Object.values(tabsConfig).map(({ menu }) => menu())}
        </TabMenu>
        {tabsConfig[tabIdx].page()}
      </Page>
    </>
  )
}
