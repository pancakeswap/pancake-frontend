import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { Heading } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useFarmsV3WithPositionsAndBooster } from 'state/farmsV3/hooks'
import FarmTable from 'views/Farms/components/FarmTable/FarmTable'
import { useCakeVaultUserData } from 'state/pools/hooks'
import { V3FarmWithoutStakedValue } from 'views/Farms/FarmsV3'
import { useAccount } from 'wagmi'

export function Step5() {
  const { farmsWithPositions: farmsV3, userDataLoaded: v3UserDataLoaded } = useFarmsV3WithPositionsAndBooster()
  const { address: account } = useAccount()

  const farmsLP = useMemo(() => farmsV3.map((f) => ({ ...f, version: 3 } as V3FarmWithoutStakedValue)), [farmsV3])

  const userDataReady = !account || (!!account && v3UserDataLoaded)
  useCakeVaultUserData()

  const cakePrice = usePriceCakeUSD()

  const { t } = useTranslation()

  return (
    <>
      <FarmTable
        header={
          <AtomBox borderTopRadius="32px" p="24px" bg="gradientCardHeader">
            <Heading>{t('Farms')}</Heading>
          </AtomBox>
        }
        farms={farmsLP}
        cakePrice={cakePrice}
        userDataReady={userDataReady}
      />
    </>
  )
}
