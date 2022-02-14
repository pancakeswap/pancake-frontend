import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Heading, Text, Button, ArrowForwardIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import Page from 'components/Layout/Page'
import ProgressSteps, { ProgressStepsType } from './components/ProgressSteps'
import MigrationSticky from './components/MigrationSticky'

const MigrationPage: React.FC = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [step, setStep] = useState<ProgressStepsType>(ProgressStepsType.STEP1)

  const handleMigrationStickyClick = () => {
    if (step === ProgressStepsType.STEP1) {
      setStep(ProgressStepsType.STEP2)
    } else {
      router.push('/')
    }
  }

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
        <ProgressSteps step={step} />
      </Page>
      <MigrationSticky step={step} handleClick={handleMigrationStickyClick} />
    </>
  )
}

export default MigrationPage
