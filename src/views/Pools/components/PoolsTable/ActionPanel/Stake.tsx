import {
  AddIcon,
  Button,
  Flex,
  IconButton,
  MinusIcon,
  Skeleton,
  Text,
  useModal,
  useTooltip,
  Box,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { PoolCategory } from 'config/constants/types'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { differenceInWeeks, formatDuration } from 'date-fns'

import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import styled from 'styled-components'
import { BIG_ZERO } from 'utils/bigNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { useProfileRequirement } from 'views/Pools/hooks/useProfileRequirement'
import { useApprovePool, useCheckVaultApprovalStatus, useVaultApprove } from '../../../hooks/useApprove'
import VaultStakeModal from '../../CakeVaultCard/VaultStakeModal'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import StakeModal from '../../PoolCard/Modals/StakeModal'
import { ProfileRequirementWarning } from '../../ProfileRequirementWarning'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { VaultStakeButtonGroup } from '../../Vault/VaultStakeButtonGroup'
import BurningCountDown from '../../LockedPool/Common/BurningCountDown'
import BurnedCake from '../../LockedPool/Common/BurnedCake'
import AfterLockedActions from '../../LockedPool/Common/AfterLockedActions'
import ExtendButton from '../../LockedPool/Buttons/ExtendDurationButton'
import AddCakeButton from '../../LockedPool/Buttons/AddCakeButton'
import LockedStakedModal from '../../LockedPool/Modals/LockedStakeModal'

const IconButtonWrapper = styled.div`
  display: flex;
`

interface StackedActionProps {
  pool: DeserializedPool
  userDataLoaded: boolean
}

const Staked: React.FunctionComponent<StackedActionProps> = ({ pool, userDataLoaded }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    stakingLimit,
    isFinished,
    poolCategory,
    userData,
    stakingTokenPrice,
    vaultKey,
    profileRequirement,
  } = pool
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { account } = useWeb3React()

  const stakingTokenContract = useERC20(stakingToken.address || '')
  const { handleApprove: handlePoolApprove, pendingTx: pendingPoolTx } = useApprovePool(
    stakingTokenContract,
    sousId,
    earningToken.symbol,
  )

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()
  const { handleApprove: handleVaultApprove, pendingTx: pendingVaultTx } = useVaultApprove(setLastUpdated)

  const handleApprove = vaultKey ? handleVaultApprove : handlePoolApprove
  const pendingTx = vaultKey ? pendingVaultTx : pendingPoolTx

  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const allowance = userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isNotVaultAndHasStake = !vaultKey && stakedBalance.gt(0)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals)
  const stakedTokenDollarBalance = getBalanceNumber(
    stakedBalance.multipliedBy(stakingTokenPrice),
    stakingToken.decimals,
  )

  const {
    userData: {
      userShares,
      lockEndTime,
      lockStartTime,
      locked,
      balance: { cakeAsBigNumber, cakeAsNumberBalance },
    },
  } = useVaultPoolByKey(pool.vaultKey)

  const hasSharesStaked = userShares && userShares.gt(0)
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
    <LockedStakedModal currentBalance={stakingTokenBalance} stakingToken={stakingToken} />,
  )

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

  const reachStakingLimit = stakingLimit.gt(0) && userData.stakedBalance.gte(stakingLimit)

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Start staking')}
          </Text>
        </ActionTitles>
        <ActionContent>
          <ConnectWalletButton width="100%" />
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

  if (needsApproval) {
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
    // Duplidate from LockedStakingApy
    const lockEndTimeSeconds = parseInt(lockEndTime) * 1000
    const diffWeeks = differenceInWeeks(new Date(lockEndTimeSeconds).getTime(), new Date().getTime())

    const vaultPosition = getVaultPosition({ userShares, locked, lockEndTime })
    return (
      <>
        <ActionContainer isAutoVault={!!vaultKey} flex={vaultPosition > 1 ? 1.5 : 1}>
          <ActionContent
            style={{
              flexWrap: 'wrap',
            }}
            mt={0}
          >
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <ActionTitles>
                <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                  {stakingToken.symbol}{' '}
                </Text>
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {vaultKey ? t('Staked') : t('Staked')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Box>
                  <Balance
                    lineHeight="1"
                    bold
                    fontSize="20px"
                    decimals={2}
                    value={vaultKey ? cakeAsNumberBalance : stakedTokenBalance}
                  />
                  <Balance
                    fontSize="12px"
                    display="inline"
                    color="textSubtle"
                    decimals={2}
                    value={vaultKey ? stakedAutoDollarValue : stakedTokenDollarBalance}
                    unit=" USD"
                    prefix="~"
                  />
                </Box>
              </ActionContent>
              {vaultPosition === VaultPosition.Locked && (
                <AddCakeButton
                  lockEndTime={lockEndTime}
                  lockStartTime={lockStartTime}
                  currentLockedAmount={cakeAsBigNumber}
                  stakingToken={stakingToken}
                  currentBalance={stakingTokenBalance}
                />
              )}
            </Flex>
            {vaultPosition >= VaultPosition.Locked && (
              <Flex mb="8px" flex="1" flexDirection="column" alignSelf="flex-start" minWidth="80px">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {t('Unlocks In')}
                </Text>
                <Text
                  lineHeight="1"
                  mt="8px"
                  bold
                  fontSize="20px"
                  color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
                >
                  {formatDuration({ weeks: diffWeeks })}
                </Text>
                <Text
                  fontSize="12px"
                  display="inline"
                  color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
                >
                  {t('Until %date%', {
                    date: new Date(lockEndTimeSeconds).toLocaleString(locale, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }),
                  })}
                </Text>
                {vaultPosition === VaultPosition.Locked && (
                  <ExtendButton
                    lockEndTime={lockEndTime}
                    lockStartTime={lockStartTime}
                    stakingToken={stakingToken}
                    currentLockedAmount={cakeAsBigNumber}
                  >
                    {t('Extend')}
                  </ExtendButton>
                )}
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
                    disabled={isFinished}
                  >
                    <AddIcon color="primary" width="14px" />
                  </IconButton>
                )}
              </IconButtonWrapper>
            )}

            {[VaultPosition.AfterBurning, VaultPosition.LockedEnd].includes(vaultPosition) && (
              <Flex flexDirection="column" alignSelf="flex-start">
                <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                  {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
                </Text>
                <Text lineHeight="1" mt="8px" bold fontSize="20px" color="failure">
                  {vaultPosition === VaultPosition.AfterBurning ? (
                    <BurnedCake account={account} />
                  ) : (
                    <BurningCountDown lockEndTime={lockEndTime} />
                  )}
                </Text>
              </Flex>
            )}
            {tooltipVisible && tooltip}
          </ActionContent>
        </ActionContainer>
        <Box
          width="100%"
          mt={['0', '0', '24px', '24px', '24px']}
          ml={['0', '0', '12px', '12px', '32px']}
          mr={['0', '0', '12px', '12px', '0']}
        >
          <AfterLockedActions
            isInline
            position={vaultPosition}
            currentLockedAmount={cakeAsNumberBalance}
            stakingToken={stakingToken}
            lockEndTime={0}
            lockStartTime={0}
          />
        </Box>
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
            onLockedClick={openPresentLockedStakeModal}
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
