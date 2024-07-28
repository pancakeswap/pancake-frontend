import { AutoColumn } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { BreadcrumbNav } from './components/BreadcrumbNav'
import { PoolInfo } from './components/PoolInfo'

export const PoolDetail: React.FC = () => {
  return (
    <Page>
      <AutoColumn gap="48px">
        <BreadcrumbNav />
        <PoolInfo />
      </AutoColumn>
    </Page>
  )
}
