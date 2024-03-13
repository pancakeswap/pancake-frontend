import {
  BalanceWithLoading,
  Box,
  Button,
  Flex,
  Heading,
  HelpIcon,
  Skeleton,
  Text,
  useMatchBreakpoints,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { styled } from 'styled-components'
import BN from 'bignumber.js'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCakeVault, VaultKey } from 'state/types'
import { VaultPosition, getVaultPosition } from 'utils/cakePool'
import BenefitsModal from 'views/Pools/components/RevenueSharing/BenefitsModal'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import useVCake from 'views/Pools/hooks/useVCake'
import { useAccount } from 'wagmi'

import AutoEarningsBreakdown from '../../AutoEarningsBreakdown'
import UnstakingFeeCountdownRow from '../../CakeVaultCard/UnstakingFeeCountdownRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import { ActionContainer, ActionContent, ActionTitles, RowActionContainer } from './styles'

const ZERO = new BN(0)

const HelpIconWrapper = styled.div`
  align-self: center;
`

interface AutoHarvestActionProps {
  pool: Pool.DeserializedPool<Token>
}

const AutoHarvestAction: React.FunctionComponent<React.PropsWithChildren<AutoHarvestActionProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isInitialization } = useVCake()
  const { isMobile } = useMatchBreakpoints()

  const { earningTokenPrice, vaultKey, userDataLoaded } = pool
  const vaultData = useVaultPoolByKey(pool.vaultKey)
  const { userData, pricePerFullShare } = vaultData
  const userShares = userData?.userShares
  const cakeAtLastUserAction = userData?.cakeAtLastUserAction
  const { hasAutoEarnings, autoCakeToDisplay, autoUsdToDisplay } = getCakeVaultEarnings(
    account,
    cakeAtLastUserAction || ZERO,
    userShares || ZERO,
    pricePerFullShare || ZERO,
    earningTokenPrice || 0,
    vaultKey === VaultKey.CakeVault
      ? (vaultData as DeserializedLockedCakeVault).userData?.currentPerformanceFee
          .plus((vaultData as DeserializedLockedCakeVault).userData?.currentOverdueFee || ZERO)
          .plus((vaultData as DeserializedLockedCakeVault).userData?.userBoostedShare || ZERO)
      : undefined,
  )

  const { secondDuration, weekDuration } = useUserDataInVaultPresenter({
    lockStartTime:
      vaultKey === VaultKey.CakeVault ? (vaultData as DeserializedLockedCakeVault).userData?.lockStartTime ?? '0' : '0',
    lockEndTime:
      vaultKey === VaultKey.CakeVault ? (vaultData as DeserializedLockedCakeVault).userData?.lockEndTime ?? '0' : '0',
  })

  const { boostFactor } = useVaultApy({ duration: secondDuration })

  const vaultPosition = getVaultPosition(vaultData.userData)

  const {
    targetRef: tagTargetRefOfRecentProfit,
    tooltip: tagTooltipOfRecentProfit,
    tooltipVisible: tagTooltipVisibleOfRecentProfit,
  } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom',
  })

  const [onPresentViewBenefitsModal] = useModal(
    <BenefitsModal pool={pool} userData={(vaultData as DeserializedLockedCakeVault)?.userData} />,
    true,
    false,
    'revenueModal',
  )

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
    <RowActionContainer style={{ flexDirection: 'column', flex: 1 }}>
      <Flex justifyContent="space-between">
        <Box width="100%">
          <ActionTitles>{actionTitle}</ActionTitles>
          <ActionContent>
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <>
                {hasAutoEarnings ? (
                  <>
                    <Flex>
                      <BalanceWithLoading lineHeight="1" bold fontSize="20px" decimals={5} value={autoCakeToDisplay} />
                      {tagTooltipVisibleOfRecentProfit && tagTooltipOfRecentProfit}
                      <HelpIconWrapper ref={tagTargetRefOfRecentProfit}>
                        <HelpIcon ml="4px" color="textSubtle" />
                      </HelpIconWrapper>
                    </Flex>
                    {Number.isFinite(earningTokenPrice) && earningTokenPrice !== undefined && earningTokenPrice > 0 && (
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
            </Flex>
          </ActionContent>
        </Box>
        {!isMobile &&
          vaultKey === VaultKey.CakeVault &&
          (vaultData as DeserializedLockedCakeVault).userData?.locked && (
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
      </Flex>
      {vaultKey === VaultKey.CakeVault &&
        (vaultData as DeserializedLockedCakeVault).userData?.locked &&
        vaultPosition === VaultPosition.Locked &&
        isInitialization && (
          <Button mt="16px" width="100%" variant="secondary" onClick={onPresentViewBenefitsModal}>
            {t('View Benefits')}
          </Button>
        )}
    </RowActionContainer>
  )
}

export default AutoHarvestAction
