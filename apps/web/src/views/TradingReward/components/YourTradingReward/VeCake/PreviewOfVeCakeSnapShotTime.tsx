import { useTranslation } from '@pancakeswap/localization'
import { Box, CheckmarkCircleFillIcon, ErrorIcon, Flex, Image, Text } from '@pancakeswap/uikit'
import { getBalanceAmount, getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { ASSET_CDN } from 'config/constants/endpoints'
import { WEEK } from 'config/constants/veCake'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { styled } from 'styled-components'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { useProxyVeCakeBalance } from 'views/CakeStaking/hooks/useProxyVeCakeBalance'
import { useProxyVeCakeBalanceOfAtTime } from 'views/CakeStaking/hooks/useProxyVeCakeBalanceOfAtTime'
import { useTargetUnlockTime } from 'views/CakeStaking/hooks/useTargetUnlockTime'
import { useCakeLockStatus, useVeCakeUserInfo } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { CakeLockStatus } from 'views/CakeStaking/types'
import { VeCakeModalView } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeAddCakeOrWeeksModal'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

const SnapShotTimeContainer = styled(Flex)<{ $isValid: boolean }>`
  width: 100%;
  flex-direction: column;
  padding: 16px;
  border-radius: 24px;
  border: ${({ $isValid, theme }) => ($isValid ? '2px dashed #e7e3eb' : `1px solid ${theme.colors.warning}`)};
  background-color: ${({ theme, $isValid }) => ($isValid ? theme.colors.tertiary : 'rgba(255, 178, 55, 0.10)')};
`

interface PreviewOfVeCakeSnapShotTimeProps {
  viewMode?: VeCakeModalView
  endTime: number
  thresholdLockAmount: number
}

export const PreviewOfVeCakeSnapShotTime: React.FC<React.PropsWithChildren<PreviewOfVeCakeSnapShotTimeProps>> = ({
  viewMode,
  endTime,
  thresholdLockAmount,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { data: userInfo } = useVeCakeUserInfo()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const { cakeUnlockTime, cakeLockExpired, nativeCakeLockedAmount, status } = useCakeLockStatus()
  const { balance: proxyVeCakeBalance } = useProxyVeCakeBalance()
  const { balance: proxyVeCakeBalanceOfAtTime } = useProxyVeCakeBalanceOfAtTime(endTime)

  const unlockTimestamp = useTargetUnlockTime(
    Number(cakeLockWeeks) * WEEK,
    cakeLockExpired || status === CakeLockStatus.NotLocked ? undefined : Number(cakeUnlockTime),
  )

  const veCakeAmount = useMemo(() => {
    const cakeAmountBN = cakeLockAmount ? getDecimalAmount(new BigNumber(cakeLockAmount)) : 0
    const unlockTimeInSec = endTime > unlockTimestamp ? 0 : new BigNumber(unlockTimestamp).minus(endTime).toNumber()
    const endTimeInSec = new BigNumber(endTime).gt(userInfo?.end?.toString() ?? 0)
      ? 0
      : new BigNumber(userInfo?.end?.toString() ?? 0).minus(endTime).toNumber()

    if (status === CakeLockStatus.NotLocked) {
      const veCakeAmountFromNative = getVeCakeAmount(cakeAmountBN.toString(), unlockTimeInSec)
      return getBalanceAmount(proxyVeCakeBalance.plus(veCakeAmountFromNative))
    }

    if (viewMode === VeCakeModalView.WEEKS_FORM_VIEW) {
      return getBalanceAmount(
        proxyVeCakeBalanceOfAtTime.plus(getVeCakeAmount(nativeCakeLockedAmount.toString(), unlockTimeInSec)),
      )
    }

    const newLockCakeAmount = getBalanceAmount(new BigNumber(nativeCakeLockedAmount.toString()).plus(cakeAmountBN))
    return getBalanceAmount(proxyVeCakeBalanceOfAtTime).plus(
      getVeCakeAmount(newLockCakeAmount.toString(), endTimeInSec),
    )
  }, [
    endTime,
    unlockTimestamp,
    userInfo?.end,
    status,
    viewMode,
    proxyVeCakeBalanceOfAtTime,
    cakeLockAmount,
    proxyVeCakeBalance,
    nativeCakeLockedAmount,
  ])

  const previewVeCake = useMemo(
    () => (veCakeAmount?.lt(0.1) ? veCakeAmount.sd(2).toString() : veCakeAmount?.toFixed(2)),
    [veCakeAmount],
  )

  const valid = useMemo(
    () => new BigNumber(veCakeAmount).gte(getBalanceAmount(new BigNumber(thresholdLockAmount))),
    [thresholdLockAmount, veCakeAmount],
  )

  return (
    <SnapShotTimeContainer $isValid={valid}>
      <Flex flexDirection={['column', 'column', 'column', 'row']} justifyContent={['space-between']}>
        <Box>
          <Text bold as="span" color="textSubtle" fontSize={12}>
            {t('Preview of')}
          </Text>
          <Text bold as="span" color="secondary" ml="4px" fontSize={12}>
            {t('*veCAKE at snapshot time:')}
          </Text>
        </Box>
        <Text>{timeFormat(locale, endTime)}</Text>
      </Flex>
      <Flex justifyContent={['space-between']}>
        <Flex>
          <Box width={39}>
            <Image
              width={39}
              height={39}
              alt="trading-reward-vecake"
              src={`${ASSET_CDN}/web/vecake/token-vecake-with-time.png`}
            />
          </Box>
          <Text style={{ alignSelf: 'center' }} bold ml="8px" fontSize="20px">
            {`${t('veCAKE')}⌛`}
          </Text>
        </Flex>
        <Flex>
          <Text bold mr="4px" fontSize="20px" color={valid ? 'text' : 'warning'} style={{ alignSelf: 'center' }}>
            {previewVeCake}
          </Text>
          {valid ? <CheckmarkCircleFillIcon color="success" width={24} /> : <ErrorIcon color="warning" width={24} />}
        </Flex>
      </Flex>
      {valid ? (
        <Text fontSize={14} mt="8px" bold textAlign="right" color="success">
          {t('Min. veCAKE will be reached at snapshot time')}
        </Text>
      ) : (
        <Text fontSize={14} mt="8px" bold textAlign="right" color="warning">
          {t('Min. veCAKE won’t be reached at snapshot time')}
        </Text>
      )}
    </SnapShotTimeContainer>
  )
}
