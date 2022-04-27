import React, { memo, useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { Heading, Text, Button, ArrowForwardIcon, Link } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePollFarmsV1WithUserData } from 'state/farmsV1/hooks'
import { VaultKey } from 'state/types'
import { useFetchUserPools } from 'views/Migration/hook/V1/Pool/useFetchUserPools'
import { useFetchPublicPoolsData } from 'views/Migration/hook/V1/Pool/useFetchPublicPoolsData'
import PageHeader from 'components/PageHeader'
import Page from 'components/Layout/Page'
import ProgressSteps, { Step, ProgressStepsType } from './components/ProgressSteps'
import MigrationSticky from './components/MigrationSticky'
import OldPool from './components/MigrationStep1/OldPool'
import OldFarm from './components/MigrationStep1/OldFarm'
import NewPool from './components/MigrationStep2/NewPool'
import NewFarm from './components/MigrationStep2/NewFarm'

const MigrationPage: React.FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
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

  // v1 Farms
  usePollFarmsV1WithUserData()

  // v1 Pools
  useFetchPublicPoolsData()
  const { data: cakePool, userDataLoaded } = useFetchUserPools(account)

  const v1Pools = useMemo(() => {
    const ifoPoolVault = { ...cakePool, vaultKey: VaultKey.IfoPool }
    const cakeAutoVault = { ...cakePool, vaultKey: VaultKey.CakeVaultV1 }

    return [ifoPoolVault, cakeAutoVault, cakePool]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cakePool])

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
          {t('Migrate your stakings to the new MasterChef contract.')}
        </Heading>
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
        <ProgressSteps pickedStep={step} steps={steps} onClick={setStep} />
        {step === ProgressStepsType.STEP1 ? (
          <>
            <OldPool pools={v1Pools} account={account} userDataLoaded={userDataLoaded} />
            <OldFarm />
          </>
        ) : (
          <>
            <NewPool />
            <NewFarm />
          </>
        )}
      </Page>
      <MigrationSticky step={step} handleClick={handleMigrationStickyClick} />
    </div>
  )
}

export default memo(MigrationPage)
