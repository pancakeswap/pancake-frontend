import { useTranslation } from '@pancakeswap/localization'
import { Card, Tab, TabMenu } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { PropsWithChildren, useState } from 'react'
import { Header } from './v4/components/Header'

export const FarmsV4: React.FC<PropsWithChildren> = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const onTabClick = (index: number) => setTab(index)

  return (
    <>
      <Header />

      <Page>
        <TabMenu activeIndex={tab} onItemClick={onTabClick} isShowBorderBottom={false}>
          <Tab>{t('All Pools (%counts%)', { counts: 1 })}</Tab>
          <Tab>{t('My Positions (%counts%)', { counts: 1 })}</Tab>
          <Tab>{t('History')}</Tab>
        </TabMenu>
        <Card>1</Card>
      </Page>
    </>
  )
}
