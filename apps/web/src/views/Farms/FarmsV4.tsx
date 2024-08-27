import { useTranslation } from '@pancakeswap/localization'
import { Card, Tab, TabMenu } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { PropsWithChildren, useMemo, useState } from 'react'
import { Header, Pools } from './v4/components'

export const FarmsV4: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const onTabClick = (index: number) => setTab(index)

  const tabsConfig = useMemo(() => {
    return {
      0: {
        menu: () => <Tab>{t('All Pools')}</Tab>,
        page: () => <Pools />,
      },
      1: {
        menu: () => <Tab>{t('My Positions')}</Tab>,
        page: () => <Card>My Positions</Card>,
      },
      2: {
        menu: () => <Tab>{t('History')}</Tab>,
        page: () => <Card>History</Card>,
      },
    }
  }, [t])

  return (
    <>
      <Header />
      <Page>
        <TabMenu activeIndex={tab} onItemClick={onTabClick} isShowBorderBottom={false}>
          {Object.values(tabsConfig).map(({ menu }) => menu())}
        </TabMenu>
        {tabsConfig[tab].page()}
      </Page>
    </>
  )
}
