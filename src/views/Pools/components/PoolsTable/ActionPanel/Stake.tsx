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
import { differenceInWeeks } from 'date-fns'

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
      locked,
      lockStartTime,
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
    const vaultPosition = getVaultPosition({ userShares, locked, lockEndTime })
    return (
      <ActionContainer isAutoVault={!!vaultKey} flex={vaultPosition > 1 ? 1.5 : 1}>
        <ActionContent mt={0}>
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
              <Box pt="16px">
                <Balance
                  lineHeight="1"
                  bold
                  fontSize="20px"
                  decimals={5}
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
          </Flex>
          {vaultPosition >= VaultPosition.Locked && (
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                {t('Locked Duration')}
              </Text>
              <Text
                lineHeight="1"
                mt="8px"
                pt="16px"
                bold
                fontSize="20px"
                color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
              >
                {differenceInWeeks(new Date(parseInt(lockEndTime) * 1000), new Date(parseInt(lockStartTime) * 1000))}{' '}
                {t('weeks')}
              </Text>
              <Text
                fontSize="12px"
                display="inline"
                color={vaultPosition >= VaultPosition.LockedEnd ? '#D67E0A' : 'text'}
              >
                {t('Until %date%', {
                  date: new Date(parseInt(lockEndTime) * 1000).toLocaleString(locale, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                })}
              </Text>
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
          {/* TODO: add adjust modal */}
          {vaultPosition === VaultPosition.Locked && <Button>{t('Adjust')}</Button>}
          {vaultPosition >= VaultPosition.LockedEnd && (
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
                {vaultPosition === VaultPosition.AfterBurning ? t('After Burning') : t('After Burning In')}
              </Text>
              <Text lineHeight="1" mt="8px" pt="16px" bold fontSize="20px" color="failure">
                {/* Count */}
              </Text>
            </Flex>
          )}
          {tooltipVisible && tooltip}
        </ActionContent>
      </ActionContainer>
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
            onLockedClick={() => {
              //
            }}
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
