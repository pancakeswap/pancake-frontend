import { Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultMaxDuration } from 'hooks/useVaultMaxDuration'
import Balance from 'components/Balance'
import { memo } from 'react'

export const StakingApy = memo(() => {
  const { t } = useTranslation()

  const maxLockDuration = useVaultMaxDuration()
  const { flexibleApy, lockedApy } = useVaultApy({ duration: maxLockDuration?.toNumber() })

  return (
    <LightGreyCard>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Flexible staking')} APY:
        </Text>
        {flexibleApy ? (
          <Balance fontSize="16px" value={parseFloat(flexibleApy)} decimals={2} unit="%" />
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
          {t('Locked staking')} APY:
        </Text>
        {lockedApy ? (
          <Balance fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" />
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Flex>
    </LightGreyCard>
  )
})
