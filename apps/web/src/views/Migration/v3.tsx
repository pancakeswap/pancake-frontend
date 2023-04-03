import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  AutoColumn,
  Box,
  Button,
  Heading,
  Link,
  PageHeader,
  RowBetween,
  Text,
} from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AtomBox } from '@pancakeswap/ui'
import LiquidityFormProvider from 'views/AddLiquidityV3/formViews/V3FormView/form/LiquidityFormProvider'
import { farmV3MigrationBunny, farmV3MigrationBunnyFull } from 'views/Home/components/Banners/images'
import { useRouter } from 'next/router'
import { usePollFarmsWithUserData } from 'state/farms/hooks'
import OldFarm from './components/v3/Step1'
import { Step2 } from './components/v3/Step2'
import MigrationSticky, { TEXT } from './components/MigrationSticky'
import { MigrationProgressSteps, Step } from './components/ProgressSteps'
import { Step3 } from './components/v3/Step3'
import { Step4 } from './components/v3/Step4'
import { Step5 } from './components/v3/Step5'

const steps: Step[] = [
  {
    stepId: 0,
    canHover: true,
    text: TEXT.v3.steps[0].title,
    subText: TEXT.v3.steps[0].subTitle,
  },
  {
    stepId: 1,
    canHover: true,
    text: TEXT.v3.steps[1].title,
    subText: TEXT.v3.steps[1].subTitle,
  },
  {
    stepId: 2,
    canHover: true,
    text: TEXT.v3.steps[2].title,
    subText: TEXT.v3.steps[2].subTitle,
  },
  {
    stepId: 3,
    canHover: true,
    text: TEXT.v3.steps[3].title,
    subText: TEXT.v3.steps[3].subTitle,
  },
  {
    stepId: 4,
    canHover: true,
    text: TEXT.v3.steps[4].title,
    subText: TEXT.v3.steps[4].subTitle,
  },
]

const MigrationPage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const stepFromQuery = router.query.step
  // const { address: account } = useAccount()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<number>(0)

  useEffect(() => {
    if (router.isReady) {
      if (+stepFromQuery >= 1 && +stepFromQuery <= 5) {
        setStep(+stepFromQuery - 1)
      }
    }
  }, [router.isReady, stepFromQuery])

  usePollFarmsWithUserData()

  const scrollToTop = (): void => {
    window.scrollTo({
      top: tableWrapperEl.current.offsetTop,
      behavior: 'smooth',
    })
  }

  const handleMigrationStickyClick = () => {
    if (steps[step + 1]) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            step: step + 2,
          },
        },
        undefined,
        { shallow: true },
      )
      setStep((s) => s + 1)
      scrollToTop()
    } else {
      router.push('/farms')
    }
  }

  return (
    <div ref={tableWrapperEl}>
      <PageHeader style={{ padding: 0, overflow: 'hidden' }}>
        <RowBetween flexWrap="nowrap">
          <AtomBox
            py={{
              xs: '16px',
              md: '24px',
            }}
          >
            <Heading as="h1" scale="xxl" color="secondary" mb="24px">
              {t('Migration')}
            </Heading>
            <Text fontSize={['12px', , '16px']} color="text">
              {t('Migrate your liquidity to Exchange V3 and keep farming CAKE rewards.')}
            </Text>
            <AutoColumn gap="4px" pt="4px">
              <Link href="https://docs.pancakeswap.finance/code/v3-migration/how-to-migrate" external>
                <Button p="0" variant="text" scale="sm">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Guide')}
                  </Text>
                  <ArrowForwardIcon color="primary" />
                </Button>
              </Link>
              <Link href="https://docs.pancakeswap.finance/code/v3-migration/faq" external>
                <Button p="0" variant="text" scale="sm">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Need help ?')}
                  </Text>
                  <ArrowForwardIcon color="primary" />
                </Button>
              </Link>
            </AutoColumn>
          </AtomBox>

          <AtomBox
            display={{
              xs: 'block',
              md: 'none',
            }}
            style={{ width: 200, height: 200 }}
            position="relative"
          >
            <Image
              style={{ visibility: 'hidden' }}
              src={farmV3MigrationBunnyFull}
              alt="farmV3MigrationBunnyFull"
              width={200}
              height={200}
              placeholder="blur"
            />
            <Box position="absolute" right={['-20px', , , '-35px']} bottom={['-80px', , , '-40px']}>
              <Image
                src={farmV3MigrationBunnyFull}
                alt="farmV3MigrationBunnyFull"
                width={200}
                height={200}
                placeholder="blur"
              />
            </Box>
          </AtomBox>
          <AtomBox
            display={{
              xs: 'none',
              md: 'block',
            }}
            alignSelf="flex-end"
          >
            <Image src={farmV3MigrationBunny} alt="farmV3MigrationBunny" width={300} height={230} placeholder="blur" />
          </AtomBox>
        </RowBetween>
      </PageHeader>
      <Page>
        <MigrationProgressSteps
          stepHairStyles={{
            left: 'calc(-100% + 106px)',
            width: '70%',
          }}
          pickedStep={step}
          steps={steps}
          onClick={(s) => {
            setStep(s)
            router.replace(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                  step: s + 1,
                },
              },
              undefined,
              { shallow: true },
            )
          }}
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
