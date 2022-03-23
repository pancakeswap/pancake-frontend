import { Token } from '@pancakeswap/sdk'
import {
  Button,
  Flex,
  HelpIcon,
  Link,
  LinkExternal,
  MetamaskIcon,
  Skeleton,
  Text,
  TimerIcon,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import Balance from 'components/Balance'
import { BASE_BSC_SCAN_URL } from 'config'
import { useTranslation } from 'contexts/Localization'
import { FC, memo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { getBscScanLink } from 'utils'
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'
import { registerToken } from 'utils/wallet'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import MaxStakeRow from '../../MaxStakeRow'
import { PerformanceFee } from '../../vault'

interface ExpandedFooterProps {
  pool: DeserializedPool
  account: string
}

export const ExpandedTotalStaked = ({ totalStaked, stakingToken }: { totalStaked: BigNumber; stakingToken: Token }) => {
  const { t } = useTranslation()
  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })

  return (
    <Flex mb="2px" justifyContent="space-between" alignItems="center">
      <Text small>{t('Total staked')}:</Text>
      <Flex alignItems="flex-start">
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <Balance
              small
              value={getBalanceNumber(totalStaked, stakingToken.decimals)}
              decimals={0}
              unit={` ${stakingToken.symbol}`}
            />
            <span ref={totalStakedTargetRef}>
              <HelpIcon color="textSubtle" width="20px" ml="6px" mt="4px" />
            </span>
          </>
        ) : (
          <Skeleton width="90px" height="21px" />
        )}
        {totalStakedTooltipVisible && totalStakedTooltip}
      </Flex>
    </Flex>
  )
}

export const ExpandedPerformanceFee: FC<{ performanceFee?: number }> = ({ performanceFee, children }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  return (
    <Flex mb="2px" justifyContent="space-between" alignItems="center">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        {t('Performance Fee')}
      </TooltipText>
      <Flex alignItems="center">
        {children ||
          (performanceFee ? (
            <Text ml="4px" small>
              {performanceFee / 100}%
            </Text>
          ) : (
            <Skeleton width="90px" height="21px" />
          ))}
      </Flex>
    </Flex>
  )
}

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    stakingLimitEndBlock,
    contractAddress,
    vaultKey,
    profileRequirement,
    isFinished,
  } = pool

  const {
    totalCakeInVault,
    fees: { performanceFeeAsDecimal },
  } = useVaultPoolByKey(vaultKey)

  const tokenAddress = earningToken.address || ''
  const poolContractAddress = getAddress(contractAddress)
  const cakeVaultContractAddress = getVaultPoolAddress(vaultKey)
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  return (
    <>
      {profileRequirement && (profileRequirement.required || profileRequirement.thresholdPoints.gt(0)) && (
        <Flex mb="8px" justifyContent="space-between">
          <Text small>{t('Requirement')}:</Text>
          <Text small textAlign="right">
            {profileRequirement.required && t('Pancake Profile')}{' '}
            {profileRequirement.thresholdPoints.gt(0) && (
              <Text small>
                {profileRequirement.thresholdPoints.toNumber().toLocaleString()} {t('Profile Points')}
              </Text>
            )}
          </Text>
        </Flex>
      )}
      <ExpandedTotalStaked totalStaked={vaultKey ? totalCakeInVault : totalStaked} stakingToken={stakingToken} />
      {!isFinished && stakingLimit && stakingLimit.gt(0) && (
        <MaxStakeRow
          small
          currentBlock={currentBlock}
          hasPoolStarted={hasPoolStarted}
          stakingLimit={stakingLimit}
          stakingLimitEndBlock={stakingLimitEndBlock}
          stakingToken={stakingToken}
        />
      )}
      {shouldShowBlockCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
          {blocksRemaining || blocksUntilStart ? (
            <Flex alignItems="center">
              <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
                <Balance small value={blocksToDisplay} decimals={0} color="primary" />
                <Text small ml="4px" color="primary" textTransform="lowercase">
                  {t('Blocks')}
                </Text>
                <TimerIcon ml="4px" color="primary" />
              </Link>
            </Flex>
          ) : (
            <Skeleton width="54px" height="21px" />
          )}
        </Flex>
      )}
      {vaultKey && (
        <PerformanceFee>
          <Text ml="4px" small>
            0~{performanceFeeAsDecimal}%
          </Text>
        </PerformanceFee>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={`/info/token/${earningToken.address}`} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal href={earningToken.projectLink} bold={false} small>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            href={`${BASE_BSC_SCAN_URL}/address/${vaultKey ? cakeVaultContractAddress : poolContractAddress}`}
            bold={false}
            small
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokenAddress && (
        <Flex justifyContent="flex-end">
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals)}
          >
            <Text color="primary" fontSize="14px">
              {t('Add to Metamask')}
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </Flex>
      )}
    </>
  )
}

export default memo(ExpandedFooter)
