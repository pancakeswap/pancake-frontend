import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Button, Heading, Link, PageHeader, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import React, { useRef, useState } from 'react'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { useRouter } from 'next/router'
import { usePollFarmsWithUserData } from 'state/farms/hooks'
import OldFarm from './components/v3/Step1'
import { Step2 } from './components/v3/Step2'
import MigrationSticky from './components/MigrationSticky'
import { MigrationProgressSteps, Step } from './components/ProgressSteps'
import { Step3 } from './components/v3/Step3'
import { Step4 } from './components/v3/Step4'
import { Step5 } from './components/v3/Step5'

const steps: Step[] = [
  {
    stepId: 0,
    canHover: true,
    text: 'Unstaking from v2 Farms',
  },
  {
    stepId: 1,
    canHover: true,
    text: 'Remove v2 Liquidity',
  },
  {
    stepId: 2,
    canHover: true,
    text: 'Get familiar with v3 Liquidity',
  },
  {
    stepId: 3,
    canHover: true,
    text: 'Provide liquidity on v3',
  },
  {
    stepId: 4,
    canHover: true,
    text: 'Restake LP in v3 Farms',
  },
]

const MigrationPage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  // const { address: account } = useAccount()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<number>(0)

  usePollFarmsWithUserData()

  const scrollToTop = (): void => {
    window.scrollTo({
      top: tableWrapperEl.current.offsetTop,
      behavior: 'smooth',
    })
  }

  const handleMigrationStickyClick = () => {
    if (steps[step + 1]) {
      setStep((s) => s + 1)
      scrollToTop()
    } else {
      router.push('/farms')
    }
  }

  return (
    <div ref={tableWrapperEl}>
      <PageHeader>
        <Heading as="h1" scale="xxl" color="secondary" mb="24px">
          {t('Migration')}
        </Heading>
        <Heading scale="lg" color="text">
          {/* TODO: v3 migration */}
          {t('Migrate your stakings to the new MasterChef contract.')}
        </Heading>
        {/* TODO: v3 migration */}
        <Link href="https://docs.pancakeswap.finance/code/migration/migrate-your-stakings" external>
          <Button p="0" variant="text">
            <Text color="primary" bold fontSize="16px" mr="4px">
              {t('Learn more')}
            </Text>
            <ArrowForwardIcon color="primary" />
          </Button>
        </Link>
      </PageHeader>
      <Page>
        <MigrationProgressSteps
          stepHairStyles={{
            left: 'calc(-100% + 106px)',
            width: '70%',
          }}
          pickedStep={step}
          steps={steps}
          onClick={setStep}
        />
        {step === 0 && <OldFarm />}
        {step === 1 && <Step2 />}
        {step === 2 && (
          <LiquidityFormProvider>
            <Step3 />
          </LiquidityFormProvider>
        )}
        {step === 3 && <Step4 />}
        {step === 4 && <Step5 />}
      </Page>
      <MigrationSticky version="v3" step={step} handleClick={handleMigrationStickyClick} />
    </div>
  )
}

export default MigrationPage
