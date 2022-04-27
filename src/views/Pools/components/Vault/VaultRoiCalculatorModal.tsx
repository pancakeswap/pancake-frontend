import { Box, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import RoiCalculatorModal, { RoiCalculatorModalProps } from 'components/RoiCalculatorModal'
import { CalculatorMode } from 'components/RoiCalculatorModal/useRoiCalculatorReducer'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultMaxDuration } from 'hooks/useVaultMaxDuration'
import { useEffect, useState, useMemo } from 'react'
import { DeserializedPool } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getRoi } from 'utils/compoundApyHelpers'

import LockDurationField from '../LockedPool/Common/LockDurationField'
import { weeksToSeconds } from '../utils/formatSecondsToWeeks'

export const VaultRoiCalculatorModal = ({
  pool,
  initialView,
  ...rest
}: { pool: DeserializedPool; initialView?: number } & Partial<RoiCalculatorModalProps>) => {
  const maxLockDuration = useVaultMaxDuration()
  const {
    userData: {
      balance: { cakeAsBigNumber },
    },
  } = useVaultPoolByKey(pool.vaultKey)

  const { getLockedApy, flexibleApy } = useVaultApy()
  const { t } = useTranslation()

  const [cakeVaultView, setCakeVaultView] = useState(initialView || 0)

  const [duration, setDuration] = useState(weeksToSeconds(1))

  const buttonMenuItems = useMemo(
    () =>
      [
        <ButtonMenuItem key="Flexible">{t('Flexible')}</ButtonMenuItem>,
        maxLockDuration?.gt(0) && <ButtonMenuItem key="Locked">{t('Locked')}</ButtonMenuItem>,
      ].filter(Boolean),
    [maxLockDuration, t],
  )

  const apy = useMemo(() => {
    return cakeVaultView === 0 ? flexibleApy : getLockedApy(duration)
  }, [cakeVaultView, getLockedApy, flexibleApy, duration])

  return (
    <RoiCalculatorModal
      stakingTokenSymbol={pool.stakingToken.symbol}
      apy={+apy}
      initialState={{
        controls: {
          compounding: false, // no compounding if apy is specify
        },
      }}
      linkHref="/swap"
      linkLabel={t('Get %symbol%', { symbol: pool.stakingToken.symbol })}
      earningTokenPrice={pool.earningTokenPrice}
      stakingTokenPrice={pool.stakingTokenPrice}
      stakingTokenBalance={
        pool.userData?.stakingTokenBalance ? cakeAsBigNumber.plus(pool.userData?.stakingTokenBalance) : cakeAsBigNumber
      }
      autoCompoundFrequency={1}
      strategy={
        cakeVaultView
          ? (state, dispatch) => (
              <LockedRoiStrategy
                state={state}
                dispatch={dispatch}
                stakingTokenPrice={pool.stakingTokenPrice}
                earningTokenPrice={pool.earningTokenPrice}
                duration={duration}
              />
            )
          : null
      }
      header={
        <ButtonMenu
          mb="24px"
          fullWidth
          scale="sm"
          variant="subtle"
          activeIndex={cakeVaultView}
          onItemClick={setCakeVaultView}
        >
          {buttonMenuItems}
        </ButtonMenu>
      }
      {...rest}
    >
      {cakeVaultView && (
        <Box mt="16px">
          <LockDurationField duration={duration} setDuration={setDuration} isOverMax={false} />
        </Box>
      )}
    </RoiCalculatorModal>
  )
}

function LockedRoiStrategy({ state, dispatch, earningTokenPrice, duration, stakingTokenPrice }) {
  const { getLockedApy } = useVaultApy()
  const { principalAsUSD, roiUSD } = state.data
  const { compounding, compoundingFrequency, stakingDuration, mode } = state.controls

  useEffect(() => {
    if (mode === CalculatorMode.ROI_BASED_ON_PRINCIPAL) {
      const principalInUSDAsNumber = parseFloat(principalAsUSD)
      const interest =
        (principalInUSDAsNumber / earningTokenPrice) * (+getLockedApy(duration) / 100) * (duration / 31449600)

      const hasInterest = !Number.isNaN(interest)
      const roiTokens = hasInterest ? interest : 0
      const roiAsUSD = hasInterest ? roiTokens * earningTokenPrice : 0
      const roiPercentage = hasInterest
        ? getRoi({
            amountEarned: roiAsUSD,
            amountInvested: principalInUSDAsNumber,
          })
        : 0
      dispatch({ type: 'setRoi', payload: { roiUSD: roiAsUSD, roiTokens, roiPercentage } })
    }
  }, [
    principalAsUSD,
    stakingDuration,
    earningTokenPrice,
    compounding,
    compoundingFrequency,
    mode,
    duration,
    dispatch,
    getLockedApy,
  ])

  useEffect(() => {
    if (mode === CalculatorMode.PRINCIPAL_BASED_ON_ROI) {
      const principalUSD = roiUSD / (+getLockedApy(duration) / 100) / (duration / 31449600)
      const roiPercentage = getRoi({
        amountEarned: roiUSD,
        amountInvested: principalUSD,
      })
      const principalToken = principalUSD / stakingTokenPrice
      dispatch({
        type: 'setPrincipalForTargetRoi',
        payload: {
          principalAsUSD: principalUSD.toFixed(2),
          principalAsToken: principalToken.toFixed(10),
          roiPercentage,
        },
      })
    }
  }, [dispatch, duration, getLockedApy, mode, roiUSD, stakingTokenPrice])

  return null
}
