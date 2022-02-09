import { Card, Heading } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import PageLoader from 'components/Loader/PageLoader'
import PageHeader from 'components/PageHeader'
import { useTranslation } from 'contexts/Localization'
import { useGetNFTInitializationState } from 'state/nftMarket/hooks'
import { NFTMarketInitializationState } from 'state/nftMarket/types'
import ActivityHistory from '../ActivityHistory/ActivityHistory'

const Activity = () => {
  const { t } = useTranslation()
  const initializationState = useGetNFTInitializationState()

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" data-test="nft-activity-title">
          {t('Activity')}
        </Heading>
      </PageHeader>
      <Page>
        {initializationState !== NFTMarketInitializationState.INITIALIZED ? (
          <PageLoader />
        ) : (
          <Card>
            <ActivityHistory />
          </Card>
        )}
      </Page>
    </>
  )
}

export default Activity
