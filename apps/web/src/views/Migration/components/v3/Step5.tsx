import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui'
import { Heading, Link, Message, MessageText } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useFarmsV3WithPositions } from 'state/farmsV3/hooks'
import differenceInHours from 'date-fns/differenceInHours'
import FarmTable from 'views/Farms/components/FarmTable/FarmTable'
import { V3FarmWithoutStakedValue } from 'views/Farms/FarmsV3'

const EXPECTED_V3_EPOCH_TIME = new Date(1680544800 * 1_000)

export function Step5() {
  const {
    farmsWithPositions: farmsV3,
    userDataLoaded: v3UserDataLoaded,
    cakePerSecond,
    isLoading,
  } = useFarmsV3WithPositions()
  const { account } = useActiveWeb3React()

  const farmsLP = useMemo(() => farmsV3.map((f) => ({ ...f, version: 3 } as V3FarmWithoutStakedValue)), [farmsV3])

  const userDataReady = !account || (!!account && v3UserDataLoaded)

  const cakePrice = usePriceCakeUSD()

  const { t } = useTranslation()

  return (
    <>
      {!isLoading && !!cakePerSecond && cakePerSecond === '0' && (
        <Message
          variant="warning"
          // @ts-ignore
          style={{ alignSelf: 'center' }}
        >
          <MessageText>
            CAKE reward emissions for V3 farms have yet to start. You can stake your V3 LPs now. Once CAKE emission
            begins on V3, you will begin earning CAKE.{' '}
            <Link fontSize="14px" href="https://twitter.com/pancakeswap" external>
              Follow our Twitter for news about the V3 launch.
            </Link>
            <br />
            <MessageText bold>ETA: ~{differenceInHours(EXPECTED_V3_EPOCH_TIME, Date.now())} hours</MessageText>
          </MessageText>
        </Message>
      )}
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
