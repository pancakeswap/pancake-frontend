import { useTranslation } from '@pancakeswap/localization'
import { Box, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
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
  > div > div > div > div:first-child > div {
    margin-top: 0;
  }

  > div > div > div > div:first-child > div:first-child {
    padding-top: 0;
  }

  > div > div > div > div:first-child > div:nth-child(2) {
    padding-left: 0px;

    ${({ theme }) => theme.mediaQueries.sm} {
      padding-left: 16px;
    }
  }
`

const ValueText = styled(Text)`
  font-size: 16px;
  font-weight: 400;
`

interface NoLockingCakeModalProps extends InjectedModalProps {
  thresholdLockAmount: number
  endTime: number
}

export const NoLockingCakeModal: React.FC<React.PropsWithChildren<NoLockingCakeModalProps>> = ({
  endTime,
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
    <StyledModal
      width="100%"
      title="Lock CAKE to get veCAKE"
      headerBorderColor="transparent"
      maxWidth={['100%', '100%', '100%', '777px']}
      onDismiss={onDismiss}
    >
      <Box width="100%" overflowX="auto">
        <NotLockingCard
          hideTitle
          hideCardPadding
          customVeCakeCard={<PreviewOfVeCakeSnapShotTime endTime={endTime} thresholdLockAmount={thresholdLockAmount} />}
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
      </Box>
    </StyledModal>
  )
}
