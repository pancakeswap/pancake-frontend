import React from 'react'
import { Card, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import ActivityHistory from '../ActivityHistory/ActivityHistory'

const Activity = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" data-test="nft-activity-title">
          {t('Activity')}
        </Heading>
      </PageHeader>
      <Page>
        <Card>
          <ActivityHistory />
        </Card>
      </Page>
    </>
  )
}

export default Activity
