import { AutoColumn } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { usePoolAprUpdater } from 'state/farmsV4/hooks'
import { BreadcrumbNav } from './components/BreadcrumbNav'
import { PoolInfo } from './components/PoolInfo'

export const PoolDetail: React.FC = () => {
  usePoolAprUpdater()

  return (
    <Page>
      <AutoColumn gap="48px">
        <BreadcrumbNav />
        <PoolInfo />
      </AutoColumn>
    </Page>
  )
}
