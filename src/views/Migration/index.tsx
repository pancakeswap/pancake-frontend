import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { Heading, Text, Button, ArrowForwardIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import PageHeader from 'components/PageHeader'
import Page from 'components/Layout/Page'
import ProgressSteps, { Step, ProgressStepsType } from './components/ProgressSteps'
import MigrationSticky from './components/MigrationSticky'
import MigrationStep1 from './components/MigrationStep1'

const MigrationPage: React.FC = () => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [step, setStep] = useState<ProgressStepsType>(ProgressStepsType.STEP1)
  const steps: Step[] = [
    {
      stepId: ProgressStepsType.STEP1,
      canHover: true,
      text: t('Unstake LP tokens and CAKE from the old MasterChef contract.'),
    },
    {
      stepId: ProgressStepsType.STEP2,
      canHover: true,
      text: t('Stake LP tokens and CAKE to the new MasterChef v2 contract.'),
    },
  ]

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const handleMigrationStickyClick = () => {
    scrollToTop()
    if (step === ProgressStepsType.STEP1) {
      setStep(ProgressStepsType.STEP2)
    } else {
      router.push('/')
    }
  }

  return (
    <div ref={tableWrapperEl}>
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
        <ProgressSteps pickedStep={step} steps={steps} onClick={setStep} />
        {step === ProgressStepsType.STEP1 ? <MigrationStep1 /> : null}
      </Page>
      <MigrationSticky step={step} handleClick={handleMigrationStickyClick} />
    </div>
  )
}

export default MigrationPage
