import { useTranslation } from '@pancakeswap/localization'
import { InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import { getDecimalAmount, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { WEEK } from 'config/constants/veCake'
import React, { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { styled } from 'styled-components'
import { DataRow } from 'views/CakeStaking/components/DataSet/DataBox'
import { NotLockingCard } from 'views/CakeStaking/components/LockCake/NotLocking'
import { useProxyVeCakeBalance } from 'views/CakeStaking/hooks/useProxyVeCakeBalance'
import { useTargetUnlockTime } from 'views/CakeStaking/hooks/useTargetUnlockTime'
import { useVeCakeAmount } from 'views/CakeStaking/hooks/useVeCakeAmount'
import { PreviewOfVeCakeSnapShotTime } from 'views/TradingReward/components/YourTradingReward/VeCake/PreviewOfVeCakeSnapShotTime'

const StyledModal = styled(Modal)`
  > div > div > div > div:first-child {
    margin-top: 0;
  }
`

const ValueText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
`

interface NoLockingCakeModalProps extends InjectedModalProps {
  customWeeks?: string
  thresholdLockAmount: number
  endTime: number
}

export const NoLockingCakeModal: React.FC<React.PropsWithChildren<NoLockingCakeModalProps>> = ({
  endTime,
  customWeeks,
  thresholdLockAmount,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const unlockTimestamp = useTargetUnlockTime(Number(cakeLockWeeks) * WEEK)
  const cakeAmountBN = useMemo(
    () => getDecimalAmount(new BigNumber(Number(cakeLockAmount))).toString(),
    [cakeLockAmount],
  )
  const { balance: proxyVeCakeBalance } = useProxyVeCakeBalance()
  const veCakeAmountFromNative = useVeCakeAmount(cakeAmountBN, unlockTimestamp)

  const veCakeAmount = useMemo(
    () => proxyVeCakeBalance.plus(veCakeAmountFromNative),
    [proxyVeCakeBalance, veCakeAmountFromNative],
  )
  const veCake = veCakeAmount ? getFullDisplayBalance(new BigNumber(veCakeAmount), 18, 3) : '0'

  return (
    <StyledModal title="Lock CAKE to get veCAKE" headerBorderColor="transparent" maxWidth={777} onDismiss={onDismiss}>
      <NotLockingCard
        hideTitle
        hideCardPadding
        customVeCakeCard={<PreviewOfVeCakeSnapShotTime endTime={endTime} thresholdLockAmount={thresholdLockAmount} />}
        customWeeks={customWeeks}
        customDataRow={
          <DataRow
            label={
              <Text fontSize={14} color="textSubtle" style={{ textTransform: 'initial' }}>
                {t('veCAKE')}
              </Text>
            }
            value={<ValueText>{veCake}</ValueText>}
          />
        }
        onDismiss={onDismiss}
      />
    </StyledModal>
  )
}
