import { useTranslation } from '@pancakeswap/localization'
import { Card, Tab, TabMenu } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { PropsWithChildren, useMemo, useState } from 'react'
import { PoolsBanner } from './components'
import { PoolsPage } from './PoolsPage'
import { PositionPage } from './PositionPage'

export const UniversalFarms: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const onTabClick = (index: number) => setTab(index)

  const tabsConfig = useMemo(() => {
    return {
      0: {
        menu: () => <Tab key="pools">{t('All Pools')}</Tab>,
        page: () => <PoolsPage />,
      },
      1: {
        menu: () => <Tab key="positions">{t('My Positions')}</Tab>,
        page: () => <PositionPage />,
      },
      2: {
        menu: () => <Tab key="history">{t('History')}</Tab>,
        page: () => <Card>History</Card>,
      },
    }
  }, [t])

  return (
    <>
      <PoolsBanner />
      <Page>
        <TabMenu activeIndex={tab} onItemClick={onTabClick} isShowBorderBottom={false}>
          {Object.values(tabsConfig).map(({ menu }) => menu())}
        </TabMenu>
        {tabsConfig[tab].page()}
      </Page>
    </>
  )
}
