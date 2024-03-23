import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowForwardIcon,
  AtomBox,
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
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { usePollFarmsWithUserData } from 'state/farms/hooks'
import bCakeMigrationImage from 'views/Farms/images/bCakeMigration.png'
import { farmV3MigrationBunnyFull } from 'views/Home/components/Banners/images'
import MigrationSticky, { TEXT } from './components/MigrationSticky'
import { MigrationProgressSteps, Step } from './components/ProgressSteps'
import OldFarm from './components/bCake/Step1'
import Step2 from './components/bCake/Step2'

const steps: Step[] = [
  {
    stepId: 0,
    canHover: true,
    text: TEXT.bCake.steps[0].title,
    subText: TEXT.bCake.steps[0].subTitle,
  },
  {
    stepId: 1,
    canHover: true,
    text: TEXT.bCake.steps[1].title,
    subText: TEXT.bCake.steps[1].subTitle,
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
    if (router.isReady && stepFromQuery) {
      if (+stepFromQuery >= 1 && +stepFromQuery <= 5) {
        setStep(+stepFromQuery - 1)
      }
    }
  }, [router.isReady, stepFromQuery])

  usePollFarmsWithUserData()

  const scrollToTop = (): void => {
    if (tableWrapperEl.current) {
      window.scrollTo({
        top: tableWrapperEl.current.offsetTop,
        behavior: 'smooth',
      })
    }
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
              {t('Migration bCake')}
            </Heading>
            <Text fontSize={['12px', null, '16px']} color="text">
              {t('Migrate your farms and position manager staking to the new staking contract.')}
            </Text>
            <AutoColumn gap="4px" pt="4px">
              <Link href="https://docs.pancakeswap.finance/code/v3-migration/how-to-migrate" external>
                <Button p="0" variant="text" scale="sm">
                  <Text color="primary" bold fontSize="16px" mr="4px">
                    {t('Learn more')}
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
            <Box position="absolute" right={['-20px', null, null, '-35px']} bottom={['-80px', null, null, '-40px']}>
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
            <Image src={bCakeMigrationImage} alt="bCakeMigrationImage" width={437} height={227} placeholder="blur" />
          </AtomBox>
        </RowBetween>
      </PageHeader>
      <Page>
        <MigrationProgressSteps
          stepHairStyles={{
            left: 'calc(((100vw - 300px) / -2) - 80px)',
            width: 'calc(100vw - 900px)',
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
      </Page>
      <MigrationSticky version="bCake" step={step} handleClick={handleMigrationStickyClick} />
    </div>
  )
}

export default MigrationPage
