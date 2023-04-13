import React, { memo, useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { Heading, Text, Button, ArrowForwardIcon, Link, PageHeader, Pool } from '@pancakeswap/uikit'
import { Trans, useTranslation } from '@pancakeswap/localization'
import { usePollFarmsV1WithUserData } from 'state/farmsV1/hooks'
import { VaultKey } from 'state/types'
import { useFetchUserPools } from 'views/Migration/hook/V1/Pool/useFetchUserPools'
import { useFetchPublicPoolsData } from 'views/Migration/hook/V1/Pool/useFetchPublicPoolsData'
import Page from 'components/Layout/Page'
import { Token } from '@pancakeswap/sdk'
import { Step, MigrationProgressSteps } from './components/ProgressSteps'
import MigrationSticky from './components/MigrationSticky'
import OldPool from './components/MigrationStep1/OldPool'
import OldFarm from './components/MigrationStep1/OldFarm'
import NewPool from './components/MigrationStep2/NewPool'
import NewFarm from './components/MigrationStep2/NewFarm'

const steps: Step[] = [
  {
    stepId: 0,
    canHover: true,
    text: <Trans>Unstake LP tokens and CAKE from the old MasterChef contract.</Trans>,
  },
  {
    stepId: 1,
    canHover: true,
    text: <Trans>Stake LP tokens and CAKE to the new MasterChef v2 contract.</Trans>,
  },
]
const MigrationPage: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [step, setStep] = useState<number>(0)

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
  }, [cakePool]) as Pool.DeserializedPool<Token>[]

  const scrollToTop = (): void => {
    window.scrollTo({
      top: tableWrapperEl.current.offsetTop,
      behavior: 'smooth',
    })
  }

  const handleMigrationStickyClick = () => {
    scrollToTop()
    if (step === 0) {
      setStep(1)
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
        <MigrationProgressSteps
          stepHairStyles={{
            left: 'calc(-100% + -24px)',
            width: '100%',
          }}
          width={['none', 'none', 'none', '653px']}
          pickedStep={step}
          steps={steps}
          onClick={setStep}
        />
        {step === 0 ? (
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
      <MigrationSticky version="v2" step={step} handleClick={handleMigrationStickyClick} />
    </div>
  )
}

export default memo(MigrationPage)
