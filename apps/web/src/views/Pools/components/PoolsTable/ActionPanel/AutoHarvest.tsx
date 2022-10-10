import { Text, Flex, Skeleton, Heading, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { useTranslation } from '@pancakeswap/localization'
import { BalanceWithLoading } from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool, VaultKey, DeserializedLockedCakeVault } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { useVaultApy } from 'hooks/useVaultApy'

import { ActionContainer, ActionTitles, ActionContent, RowActionContainer } from './styles'
import UnstakingFeeCountdownRow from '../../CakeVaultCard/UnstakingFeeCountdownRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'

const AutoHarvestAction: React.FunctionComponent<React.PropsWithChildren<DeserializedPool>> = ({
  userDataLoaded,
  earningTokenPrice,
  vaultKey,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { isMobile } = useMatchBreakpoints()

  const vaultData = useVaultPoolByKey(vaultKey)
  const {
    userData: { userShares, cakeAtLastUserAction },
    pricePerFullShare,
  } = vaultData
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    vaultKey === VaultKey.CakeVault
      ? (vaultData as DeserializedLockedCakeVault).userData.currentPerformanceFee
          .plus((vaultData as DeserializedLockedCakeVault).userData.currentOverdueFee)
          .plus((vaultData as DeserializedLockedCakeVault).userData.userBoostedShare)
      : null,
  )

  const { secondDuration, weekDuration } = useUserDataInVaultPresenter({
    lockStartTime:
      vaultKey === VaultKey.CakeVault ? (vaultData as DeserializedLockedCakeVault).userData?.lockStartTime ?? '0' : '0',
    lockEndTime:
      vaultKey === VaultKey.CakeVault ? (vaultData as DeserializedLockedCakeVault).userData?.lockEndTime ?? '0' : '0',
  })

  const { boostFactor } = useVaultApy({ duration: secondDuration })

  const vaultPosition = getVaultPosition(vaultData.userData)

  const actionTitle = (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent CAKE profit')}
    </Text>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Heading>0</Heading>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <RowActionContainer justifyContent="space-between">
      <Box width="100%">
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Flex flex="1" flexDirection="column" alignSelf="flex-start">
            <>
              {hasAutoEarnings ? (
                <>
                  <BalanceWithLoading lineHeight="1" bold fontSize="20px" decimals={5} value={autoCakeToDisplay} />
                  {Number.isFinite(earningTokenPrice) && earningTokenPrice > 0 && (
                    <BalanceWithLoading
                      display="inline"
                      fontSize="12px"
                      color="textSubtle"
                      decimals={2}
                      prefix="~"
                      value={autoUsdToDisplay}
                      unit=" USD"
                    />
                  )}
                </>
              ) : (
                <>
                  <Heading color="textDisabled">0</Heading>
                  <Text fontSize="12px" color="textDisabled">
                    0 USD
                  </Text>
                </>
              )}
            </>
          </Flex>
          <Flex flex="1.3" flexDirection="column" alignSelf="flex-start" alignItems="flex-start">
            {[VaultPosition.Flexible, VaultPosition.None].includes(vaultPosition) && (
              <UnstakingFeeCountdownRow vaultKey={vaultKey} isTableVariant />
            )}
            {/* IFO credit here */}
          </Flex>
        </ActionContent>
      </Box>
      {!isMobile && vaultKey === VaultKey.CakeVault && (vaultData as DeserializedLockedCakeVault).userData.locked && (
        <Box minWidth="123px">
          <ActionTitles>
            <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
              {t('Yield boost')}
            </Text>
          </ActionTitles>
          <ActionContent>
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <BalanceWithLoading
                color="text"
                lineHeight="1"
                bold
                fontSize="20px"
                value={boostFactor ? boostFactor?.toString() : '0'}
                decimals={2}
                unit="x"
              />
              <Text fontSize="12px" color="textSubtle">
                {t('Lock for %duration%', { duration: weekDuration })}
              </Text>
            </Flex>
          </ActionContent>
        </Box>
      )}
    </RowActionContainer>
  )
}

export default AutoHarvestAction
