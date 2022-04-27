import styled, { keyframes, css } from 'styled-components'
import {
  Box,
  Button,
  Flex,
  HelpIcon,
  Link,
  LinkExternal,
  MetamaskIcon,
  Skeleton,
  Text,
  TimerIcon,
  useTooltip,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { getBscScanLink } from 'utils'
import { useCurrentBlock } from 'state/block/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { registerToken } from 'utils/wallet'
import { getBalanceNumber } from 'utils/formatBalance'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import Harvest from './Harvest'
import Stake from './Stake'
import Apr from '../../Apr'
import AutoHarvest from './AutoHarvest'
import MaxStakeRow from '../../MaxStakeRow'
import { PerformanceFee, DurationAvg } from '../../Stat'
import { VaultPositionTagWithLabel } from '../../Vault/VaultPositionTag'
import YieldBoostRow from '../../LockedPool/Common/YieldBoostRow'
import LockDurationRow from '../../LockedPool/Common/LockDurationRow'
import useUserDataInVaultPrensenter from '../../LockedPool/hooks/useUserDataInVaultPrensenter'
import CakeVaultApr from './CakeVaultApr'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 1000px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 1000px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
          ${expandAnimation} 300ms linear forwards
        `
      : css`
          ${collapseAnimation} 300ms linear forwards
        `};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dropdown};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  padding: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 16px 32px;
  }
`

const ActionContainer = styled.div<{ isAutoVault?: boolean; hasBalance?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: ${({ isAutoVault }) => (isAutoVault ? 'row' : null)};
    align-items: ${({ isAutoVault, hasBalance }) => (isAutoVault ? (hasBalance ? 'flex-start' : 'stretch') : 'center')};
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean
}

interface ActionPanelProps {
  account: string
  pool: DeserializedPool
  userDataLoaded: boolean
  expanded: boolean
  breakpoints: MediaBreakpoints
}

const InfoSection = styled(Box)`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;

  padding: 8px 8px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0;
    flex-basis: 230px;
    ${Text} {
      font-size: 14px;
    }
  }
`

const RequirementSection = styled(Box)`
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: inline-block;

    > div {
      display: inline;
      margin-right: 4px;
    }
  }
`

const YieldBoostDurationRow = ({ lockEndTime, lockStartTime }) => {
  const { weekDuration, secondDuration } = useUserDataInVaultPrensenter({
    lockEndTime,
    lockStartTime,
  })

  return (
    <>
      <YieldBoostRow secondDuration={secondDuration} />
      <LockDurationRow weekDuration={weekDuration} />
    </>
  )
}

const ActionPanel: React.FC<ActionPanelProps> = ({ account, pool, userDataLoaded, expanded, breakpoints }) => {
  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    stakingLimitEndBlock,
    contractAddress,
    userData,
    vaultKey,
    profileRequirement,
    isFinished,
  } = pool
  const { t } = useTranslation()
  const poolContractAddress = getAddress(contractAddress)
  const vaultContractAddress = getVaultPoolAddress(vaultKey)
  const currentBlock = useCurrentBlock()
  const { isXs, isSm, isMd } = breakpoints
  const { isMobile } = useMatchBreakpoints()

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const tokenAddress = earningToken.address || ''

  const vaultPool = useVaultPoolByKey(vaultKey)
  const {
    totalCakeInVault,
    userData: {
      lockEndTime,
      lockStartTime,
      balance: { cakeAsBigNumber },
      locked,
    },
    fees: { performanceFeeAsDecimal },
  } = vaultPool

  const vaultPosition = getVaultPosition(vaultPool.userData)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const poolStakingTokenBalance = vaultKey
    ? cakeAsBigNumber.plus(stakingTokenBalance)
    : stakedBalance.plus(stakingTokenBalance)

  const getTotalStakedBalance = () => {
    if (vaultKey) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }

    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Rewards are distributed and included into your staking balance automatically. There’s no need to manually compound your rewards.',
  )

  const {
    targetRef: tagTargetRef,
    tooltip: tagTooltip,
    tooltipVisible: tagTooltipVisible,
  } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText, {
    placement: 'bottom-start',
  })

  const requirementRow =
    profileRequirement && (profileRequirement.required || profileRequirement.thresholdPoints.gt(0)) ? (
      <RequirementSection mb="8px">
        <Text>{t('Requirement')}:</Text>
        <Text textAlign={['right', , , , 'left']}>
          {profileRequirement.required && t('Pancake Profile')}{' '}
          {profileRequirement.required && profileRequirement.thresholdPoints.gt(0) && (
            <Text as="span" display={['none', , , , 'inline']}>
              {' & '}
            </Text>
          )}
          {profileRequirement.thresholdPoints.gt(0) && (
            <Text>
              {profileRequirement.thresholdPoints.toNumber().toLocaleString()} {t('Profile Points')}
            </Text>
          )}
        </Text>
      </RequirementSection>
    ) : null

  const maxStakeRow =
    !isFinished && stakingLimit.gt(0) ? (
      <MaxStakeRow
        currentBlock={currentBlock}
        hasPoolStarted={hasPoolStarted}
        stakingLimit={stakingLimit}
        stakingLimitEndBlock={stakingLimitEndBlock}
        stakingToken={stakingToken}
      />
    ) : null

  const blocksRow =
    blocksRemaining || blocksUntilStart ? (
      <Flex mb="8px" justifyContent="space-between">
        <Text>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
        <Flex>
          <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
            <Balance fontSize="16px" value={blocksToDisplay} decimals={0} color="primary" />
            <Text ml="4px" color="primary" textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Link>
        </Flex>
      </Flex>
    ) : (
      <Skeleton width="56px" height="16px" />
    )

  const aprRow = !vaultKey && (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text>{t('APR')}:</Text>
      <Apr pool={pool} showIcon stakedBalance={poolStakingTokenBalance} performanceFee={0} />
    </Flex>
  )

  const totalStakedRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="8px">
      <Text maxWidth={['50px', '100%']}>{t('Total staked')}:</Text>
      <Flex alignItems="center">
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <Balance fontSize="16px" value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
            <span ref={totalStakedTargetRef}>
              <HelpIcon color="textSubtle" width="20px" ml="4px" />
            </span>
          </>
        ) : (
          <Skeleton width="56px" height="16px" />
        )}
        {totalStakedTooltipVisible && totalStakedTooltip}
      </Flex>
    </Flex>
  )

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        {isMobile && locked && (
          <Box mb="16px">
            <YieldBoostDurationRow lockEndTime={lockEndTime} lockStartTime={lockStartTime} />
          </Box>
        )}
        {requirementRow}
        {maxStakeRow}
        {pool.vaultKey && (
          <PerformanceFee userData={vaultPool?.userData} performanceFeeAsDecimal={performanceFeeAsDecimal} />
        )}
        {vaultKey && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <DurationAvg />
          </Flex>
        )}
        {(isXs || isSm) && aprRow}
        {(isXs || isSm || isMd) && totalStakedRow}
        {shouldShowBlockCountdown && blocksRow}
        <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
          <LinkExternal href={`/info/token/${earningToken.address}`} bold={false}>
            {t('See Token Info')}
          </LinkExternal>
        </Flex>
        {!pool.vaultKey && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <LinkExternal href={earningToken.projectLink} bold={false}>
              {t('View Project Site')}
            </LinkExternal>
          </Flex>
        )}
        {pool.vaultKey && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <LinkExternal href="https://docs.pancakeswap.finance/products/syrup-pool/new-cake-pool" bold={false}>
              {t('View Tutorial')}
            </LinkExternal>
          </Flex>
        )}
        {poolContractAddress && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <LinkExternal
              href={`${BASE_BSC_SCAN_URL}/address/${vaultKey ? vaultContractAddress : poolContractAddress}`}
              bold={false}
            >
              {t('View Contract')}
            </LinkExternal>
          </Flex>
        )}
        {account && isMetaMaskInScope && tokenAddress && (
          <Flex mb="8px" justifyContent={['flex-end', 'flex-end', 'flex-start']}>
            <Button
              variant="text"
              p="0"
              height="auto"
              onClick={() =>
                registerToken(
                  tokenAddress,
                  earningToken.symbol,
                  earningToken.decimals,
                  `https://tokens.pancakeswap.finance/images/${tokenAddress}.png`,
                )
              }
            >
              <Text color="primary">{t('Add to Metamask')}</Text>
              <MetamaskIcon ml="4px" />
            </Button>
          </Flex>
        )}
        {vaultKey ? <CompoundingPoolTag /> : <ManualPoolTag />}
        {tagTooltipVisible && tagTooltip}
        <span ref={tagTargetRef}>
          <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
        </span>
      </InfoSection>
      <ActionContainer>
        {isMobile && vaultKey && vaultPosition === VaultPosition.None && (
          <CakeVaultApr pool={pool} userData={vaultPool.userData} vaultPosition={vaultPosition} />
        )}
        <Box width="100%">
          {pool.vaultKey && (
            <VaultPositionTagWithLabel
              userData={vaultPool.userData}
              width={['auto', , 'fit-content']}
              ml={['12px', , , , , '32px']}
            />
          )}
          <ActionContainer isAutoVault={!!pool.vaultKey} hasBalance={poolStakingTokenBalance.gt(0)}>
            {pool.vaultKey ? (
              <AutoHarvest {...pool} userDataLoaded={userDataLoaded} />
            ) : (
              <Harvest {...pool} userDataLoaded={userDataLoaded} />
            )}
            <Stake pool={pool} userDataLoaded={userDataLoaded} />
          </ActionContainer>
        </Box>
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
