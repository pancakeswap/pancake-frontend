import {
  AddIcon,
  Balance,
  Box,
  Button,
  Flex,
  HelpIcon,
  IconButton,
  MinusIcon,
  Skeleton,
  SkeletonV2,
  Text,
  useMatchBreakpoints,
  useModal,
  useTooltip,
} from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PoolCategory } from 'config/constants/types'
import { useERC20 } from 'hooks/useContract'
import { useAccount } from 'wagmi'

import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedCakeVault, VaultKey } from 'state/types'
import { styled } from 'styled-components'
import { VaultPosition, getVaultPosition } from 'utils/cakePool'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'

import { useCallback } from 'react'
import { logGTMClickEnablePoolEvent } from 'utils/customGTMEventTracking'
import { VeCakeButton } from 'views/CakeStaking/components/SyrupPool/VeCakeButton'
import { useIsUserDelegated } from 'views/CakeStaking/hooks/useIsUserDelegated'
import { useApprovePool, useCheckVaultApprovalStatus, useVaultApprove } from '../../../hooks/useApprove'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'
import BurningCountDown from '../../LockedPool/Common/BurningCountDown'
import LockedStakedModal from '../../LockedPool/Modals/LockedStakeModal'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import StakeModal from '../../Modals/StakeModal'
import OriginalLockedInfo from '../../OriginalLockedInfo'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'
import { VaultStakeButtonGroup } from '../../Vault/VaultStakeButtonGroup'
import { ActionContainer, ActionContent, ActionTitles } from './styles'

const IconButtonWrapper = styled.div`
  display: flex;
`
const HelpIconWrapper = styled.div`
  align-self: center;
`

interface StackedActionProps {
  pool: Pool.DeserializedPool<Token>
}

const Staked: React.FunctionComponent<React.PropsWithChildren<StackedActionProps>> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    profileRequirement,
    stakingTokenPrice = 0,
    userDataLoaded,
  } = pool
  const vaultKey = pool.vaultKey as Pool.VaultKey
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isMobile } = useMatchBreakpoints()

  const stakingTokenContract = useERC20(stakingToken.address)
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(vaultKey)
  const { handleApprove: handleVaultApprove, pendingTx: pendingVaultTx } = useVaultApprove(vaultKey, setLastUpdated)

  const handleApprove = useCallback(() => {
    if (vaultKey) {
      handleVaultApprove()
    } else {
      handlePoolApprove()
    }

    logGTMClickEnablePoolEvent(stakingToken.symbol)
  }, [handlePoolApprove, handleVaultApprove, stakingToken.symbol, vaultKey])

  const pendingTx = vaultKey ? pendingVaultTx : pendingPoolTx

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !vaultKey && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = stakingTokenPrice
    ? getBalanceNumber(stakedBalance.multipliedBy(stakingTokenPrice), stakingToken.decimals)
    : 0

  const vaultData = useVaultPoolByKey(vaultKey) as DeserializedLockedCakeVault

  const userShares = vaultData.userData?.userShares ?? new BigNumber(0)
  const cakeAsBigNumber = vaultData.userData?.balance?.cakeAsBigNumber ?? new BigNumber(0)
  const cakeAsNumberBalance = vaultData.userData?.balance?.cakeAsNumberBalance ?? 0

  const { lockEndDate, remainingTime, burnStartTime } = useUserDataInVaultPresenter({
    lockStartTime: vaultKey === VaultKey.CakeVault ? vaultData.userData?.lockStartTime ?? '0' : '0',
    lockEndTime: vaultKey === VaultKey.CakeVault ? vaultData.userData?.lockEndTime ?? '0' : '0',
    burnStartTime: vaultKey === VaultKey.CakeVault ? vaultData.userData?.burnStartTime ?? '0' : '0',
  })

  const hasSharesStaked = userShares.gt(0)
  const isVaultWithShares = vaultKey && hasSharesStaked
  const stakedAutoDollarValue = getBalanceNumber(cakeAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken.decimals)

  const needsApproval = vaultKey ? !isVaultApproved : !allowance.gt(0) && !isBnbPool

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const [onPresentStake] = useModal(
    <StakeModal
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenBalance={stakingTokenBalance}
      stakingTokenPrice={stakingTokenPrice}
    />,
  )

  const [onPresentVaultStake] = useModal(<VaultStakeModal stakingMax={stakingTokenBalance} pool={pool} />)

  const [onPresentUnstake] = useModal(
    <StakeModal
      stakingTokenBalance={stakingTokenBalance}
      isBnbPool={isBnbPool}
      pool={pool}
      stakingTokenPrice={stakingTokenPrice}
      isRemovingStake
    />,
  )

  const [onPresentVaultUnstake] = useModal(<VaultStakeModal stakingMax={cakeAsBigNumber} pool={pool} isRemovingStake />)

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakedModal
      currentBalance={stakingTokenBalance}
      stakingToken={stakingToken}
      stakingTokenPrice={stakingTokenPrice}
      stakingTokenBalance={stakingTokenBalance}
    />,
  )
  const isUserDelegated = useIsUserDelegated()

  const { notMeetRequired, notMeetThreshold } = useProfileRequirement(profileRequirement)

  const onStake = () => {
    if (vaultKey) {
      onPresentVaultStake()
    } else {
      onPresentStake()
    }
  }

  const onUnstake = () => {
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("You've already staked the maximum amount you can stake in this pool!"),
    { placement: 'bottom' },
  )

  const tooltipContentOfBurn = t(
    'After Burning starts at %burnStartTime%. You need to renew your fix-term position, to initiate a new lock or convert your staking position to flexible before it starts. Otherwise all the rewards will be burned within the next 90 days.',
    { burnStartTime },
  )
  const {
    targetRef: tagTargetRefOfBurn,
    tooltip: tagTooltipOfBurn,
    tooltipVisible: tagTooltipVisibleOfBurn,
  } = useTooltip(tooltipContentOfBurn, {
    placement: 'bottom',
  })

  const {
    targetRef: tagTargetRefOfLocked,
    tooltip: tagTooltipOfLocked,
    tooltipVisible: tagTooltipVisibleOfLocked,
  } = useTooltip(<OriginalLockedInfo pool={pool} />, {
    placement: 'bottom',
  })

  const reachStakingLimit = stakingLimit?.gt(0) && userData?.stakedBalance?.gte(stakingLimit)
  const isLocked = vaultKey === VaultKey.CakeVault && vaultData.userData?.locked
  const vaultPosition = getVaultPosition(vaultData.userData)
  if (
    !account ||
    (account &&
      vaultPosition === VaultPosition.None &&
      (vaultKey === VaultKey.CakeVault || vaultKey === VaultKey.CakeFlexibleSideVault)) ||
    ((vaultKey === VaultKey.CakeVault || vaultKey === VaultKey.CakeFlexibleSideVault) && isUserDelegated)
  ) {
    if (isMobile) {
      return vaultKey === VaultKey.CakeVault || vaultKey === VaultKey.CakeFlexibleSideVault ? (
        <VeCakeButton type="get" />
      ) : (
        <ConnectWalletButton width="100%" />
      )
    }
    if (vaultKey === VaultKey.CakeVault && isUserDelegated) return null
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {vaultKey === VaultKey.CakeVault || vaultKey === VaultKey.CakeFlexibleSideVault
              ? t('Stake & Lock for veCAKE, to enjoy more rewards & benefit!')
              : t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          {vaultKey === VaultKey.CakeVault || vaultKey === VaultKey.CakeFlexibleSideVault ? (
            <VeCakeButton type="get" />
          ) : (
            <ConnectWalletButton width="100%" />
          )}
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (notMeetRequired || notMeetThreshold) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ProfileRequirementWarning profileRequirement={profileRequirement} />
        </ActionContent>
      </ActionContainer>
    )
  }

  if (needsApproval && !isNotVaultAndHasStake && !isVaultWithShares && !pool.isFinished) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Enable pool')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" disabled={pendingTx} onClick={handleApprove} variant="secondary">
            {t('Enable')}
          </Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  // Wallet connected, user data loaded and approved
  if (isNotVaultAndHasStake || isVaultWithShares) {
    return (
      <>
        <ActionContainer flex={1}>
          <ActionContent mt={0}>
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <ActionTitles>
                <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                  {stakingToken.symbol}{' '}
                </Text>
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {isLocked ? t('Locked') : t('Staked')}
                </Text>
              </ActionTitles>
              <Flex mt={2}>
                <Box position="relative">
                  <Flex>
                    <Balance
                      lineHeight="1"
                      bold
                      fontSize="20px"
                      decimals={5}
                      value={vaultKey ? cakeAsNumberBalance : stakedTokenBalance}
                    />
                    {isLocked ? (
                      <>
                        {' '}
                        {tagTooltipVisibleOfLocked && tagTooltipOfLocked}
                        <HelpIconWrapper ref={tagTargetRefOfLocked}>
                          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                        </HelpIconWrapper>
                      </>
                    ) : null}
                  </Flex>
                  <SkeletonV2
                    isDataReady={Number.isFinite(vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance)}
                    width={120}
                    wrapperProps={{ height: '20px' }}
                    skeletonTop="2px"
                  >
                    <Balance
                      fontSize="12px"
                      display="inline"
                      color="textSubtle"
                      decimals={2}
                      value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                      unit=" USD"
                      prefix="~"
                    />
                  </SkeletonV2>
                </Box>
              </Flex>
              {/* {vaultPosition === VaultPosition.Locked && (
                <Box mt="16px">
                  <AddCakeButton
                    lockEndTime={(vaultData as DeserializedLockedCakeVault).userData.lockEndTime}
                    lockStartTime={(vaultData as DeserializedLockedCakeVault).userData.lockStartTime}
                    currentLockedAmount={cakeAsBigNumber}
                    stakingToken={stakingToken}
                    stakingTokenPrice={stakingTokenPrice}
                    currentBalance={stakingTokenBalance}
                    stakingTokenBalance={stakingTokenBalance}
                  />
                </Box>
              )} */}
            </Flex>
            {vaultPosition >= VaultPosition.Locked && (
              <Flex flex="1" ml="20px" flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {t('Unlocks In')}
                </Text>
                <Flex mt={2}>
                  <Text
                    lineHeight="1"
                    bold
                    fontSize="20px"
                    color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
                  >
                    {vaultPosition >= VaultPosition.LockedEnd ? t('Unlocked') : remainingTime}
                  </Text>
                  {tagTooltipVisibleOfBurn && tagTooltipOfBurn}
                  <span ref={tagTargetRefOfBurn}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </span>
                </Flex>
                <Text
                  height="20px"
                  fontSize="12px"
                  display="inline"
                  color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
                >
                  {t('On %date%', { date: lockEndDate })}
                </Text>
                {/* {vaultPosition === VaultPosition.Locked && (
                  <Box mt="16px">
                    <ExtendButton
                      lockEndTime={(vaultData as DeserializedLockedCakeVault).userData.lockEndTime}
                      lockStartTime={(vaultData as DeserializedLockedCakeVault).userData.lockStartTime}
                      stakingToken={stakingToken}
                      stakingTokenPrice={stakingTokenPrice}
                      currentBalance={stakingTokenBalance}
                      currentLockedAmount={cakeAsNumberBalance}
                    >
                      {t('Extend')}
                    </ExtendButton>
                  </Box>
                )} */}
              </Flex>
            )}
            {(vaultPosition === VaultPosition.Flexible || !vaultKey) && (
              <IconButtonWrapper>
                <IconButton variant="secondary" onClick={onUnstake} mr="6px">
                  <MinusIcon color="primary" width="14px" />
                </IconButton>
                {reachStakingLimit ? (
                  <span ref={targetRef}>
                    <IconButton variant="secondary" disabled>
                      <AddIcon color="textDisabled" width="24px" height="24px" />
                    </IconButton>
                  </span>
                ) : (
                  <IconButton
                    variant="secondary"
                    onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
                    disabled={vaultPosition === VaultPosition.Flexible || isFinished}
                  >
                    <AddIcon color="primary" width="14px" />
                  </IconButton>
                )}
              </IconButtonWrapper>
            )}
            {!isMobile && vaultPosition >= VaultPosition.LockedEnd && (
              <Flex flex="1" ml="20px" flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
                </Text>
                <Text lineHeight="1" mt="8px" bold fontSize="20px" color="failure">
                  {vaultPosition === VaultPosition.AfterBurning ? (
                    isUndefinedOrNull(vaultData.userData?.currentOverdueFee) ? (
                      '-'
                    ) : (
                      t('%amount% Burned', {
                        amount: getFullDisplayBalance(vaultData.userData?.currentOverdueFee ?? new BigNumber(0), 18, 5),
                      })
                    )
                  ) : vaultData.userData?.lockEndTime ? (
                    <BurningCountDown lockEndTime={vaultData.userData?.lockEndTime} />
                  ) : null}
                </Text>
              </Flex>
            )}
            {tooltipVisible && tooltip}
          </ActionContent>
        </ActionContainer>
        {isMobile && vaultPosition >= VaultPosition.LockedEnd && (
          <Flex mb="24px" mr="4px" ml="4px" justifyContent="space-between">
            <Text fontSize="14px" color="failure" as="span">
              {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
            </Text>
            <Text fontSize="14px" bold color="failure">
              {vaultPosition === VaultPosition.AfterBurning ? (
                isUndefinedOrNull(vaultData.userData?.currentOverdueFee) ? (
                  '-'
                ) : (
                  t('%amount% Burned', {
                    amount: getFullDisplayBalance(vaultData.userData?.currentOverdueFee ?? new BigNumber(0), 18, 5),
                  })
                )
              ) : vaultData.userData?.lockEndTime ? (
                <BurningCountDown lockEndTime={vaultData.userData.lockEndTime} />
              ) : null}
            </Text>
          </Flex>
        )}
        {/* {[VaultPosition.AfterBurning, VaultPosition.LockedEnd].includes(vaultPosition) && (
          <Box
            width="100%"
            mt={['0', '0', '24px', '24px', '24px']}
            ml={['0', '0', '12px', '12px', '12px', '32px']}
            mr={['0', '0', '12px', '12px', '12px', '0px']}
          >
            <AfterLockedActions
              isInline
              position={vaultPosition}
              currentLockedAmount={cakeAsNumberBalance}
              stakingToken={stakingToken}
              stakingTokenPrice={stakingTokenPrice}
              lockEndTime="0"
              lockStartTime="0"
            />
          </Box>
        )} */}
      </>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {t('Stake')}{' '}
        </Text>
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {stakingToken.symbol}
        </Text>
      </ActionTitles>
      <ActionContent>
        {vaultKey ? (
          <VaultStakeButtonGroup
            onFlexibleClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            onLockedClick={vaultKey === VaultKey.CakeVault ? openPresentLockedStakeModal : () => {}}
          />
        ) : (
          <Button
            width="100%"
            onClick={stakingTokenBalance.gt(0) ? onStake : onPresentTokenRequired}
            variant="secondary"
            disabled={isFinished}
          >
            {t('Stake')}
          </Button>
        )}
      </ActionContent>
    </ActionContainer>
  )
}

export default Staked
