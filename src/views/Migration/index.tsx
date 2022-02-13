import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Heading, Text, Button, ArrowForwardIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import Page from 'components/Layout/Page'
import ProgressSteps from './components/ProgressSteps'

const MigrationPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('Migration')}
        </Heading>
        <Heading scale="lg" color="text">
          {t('Migrate your farms and pools staking to the new staking contract.')}
        </Heading>
        <Link href="https://pancakeswap.finance/farms" external>
          <Button p="0" variant="text">
            <Text color="primary" bold fontSize="16px" mr="4px">
              {t('Learn more')}
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </Link>
      </PageHeader>
      <Page>
        <ProgressSteps />
      </Page>
    </>
  )
}

export default MigrationPage
