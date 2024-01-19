import { Flex, LinkExternal, ScanLink, Skeleton, Text } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import { DeserializedLockedCakeVault } from '@pancakeswap/pools'
import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { memo, useMemo } from 'react'
import { useCurrentBlock } from 'state/block/hooks'
import { getTokenInfoPath } from 'state/info/utils'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { getVaultPoolAddress } from 'utils/addressHelpers'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import MaxStakeRow from './MaxStakeRow'
import { AprInfo, DurationAvg, TotalLocked } from './Stat'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<React.PropsWithChildren<ExpandedFooterProps>> = ({
  pool,
  account,
  showTotalStaked = true,
  alignLinksToRight = true,
}) => {
  const { t } = useTranslation()
  const currentBlock = useCurrentBlock()
  const { chainId } = useActiveChainId()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startTimestamp,
    endTimestamp,
    stakingLimit,
    stakingLimitEndTimestamp,
    contractAddress,
    vaultKey,
    profileRequirement,
    isFinished,
    userData: poolUserData,
  } = pool

  const stakedBalance = poolUserData?.stakedBalance ? poolUserData.stakedBalance : BIG_ZERO

  const { totalCakeInVault, totalLockedAmount } = useVaultPoolByKey(
    vaultKey as Pool.VaultKey,
  ) as DeserializedLockedCakeVault

  const tokenAddress = earningToken.address || ''
  const poolContractAddress = contractAddress
  const cakeVaultContractAddress = vaultKey ? getVaultPoolAddress(vaultKey, chainId) : ''

  const { shouldShowBlockCountdown, timeUntilStart, timeRemaining, hasPoolStarted } = getPoolBlockInfo(
    pool,
    currentBlock,
  )
  const tokenInfoPath = useMemo(
    () => (chainId ? getTokenInfoPath(chainId, earningToken.address) : ''),
    [chainId, earningToken.address],
  )

  return (
    <>
      {profileRequirement && (profileRequirement.required || profileRequirement.thresholdPoints.gt(0)) && (
        <Flex mb="8px" justifyContent="space-between">
          <Text small>{t('Requirement')}:</Text>
          <Text small textAlign="right">
            {profileRequirement.required && t('Pancake Profile')}{' '}
            {profileRequirement.thresholdPoints.gt(0) && (
              <Text small>
                {profileRequirement.thresholdPoints.toNumber()} {t('Profile Points')}
              </Text>
            )}
          </Text>
        </Flex>
      )}
      {!vaultKey && <AprInfo pool={pool} stakedBalance={stakedBalance} />}
      {showTotalStaked && (
        <Pool.TotalStaked
          totalStaked={(vaultKey ? totalCakeInVault : totalStaked) || BIG_ZERO}
          tokenDecimals={stakingToken.decimals}
          symbol={stakingToken.symbol}
          decimalsToShow={0}
        />
      )}
      {vaultKey === VaultKey.CakeVault && (
        <TotalLocked totalLocked={totalLockedAmount || BIG_ZERO} lockedToken={stakingToken} />
      )}
      {vaultKey === VaultKey.CakeVault && <DurationAvg />}
      {!isFinished && stakingLimit && stakingLimit.gt(0) && (
        <MaxStakeRow
          small
          currentBlock={currentBlock}
          hasPoolStarted={hasPoolStarted}
          stakingLimit={stakingLimit}
          stakingLimitEndTimestamp={stakingLimitEndTimestamp || 0}
          stakingToken={stakingToken}
          endTimestamp={endTimestamp || 0}
        />
      )}
      {shouldShowBlockCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
          {timeRemaining || timeUntilStart ? (
            <Pool.TimeCountdownDisplay timestamp={(hasPoolStarted ? endTimestamp : startTimestamp) || 0} />
          ) : (
            <Skeleton width="54px" height="21px" />
          )}
        </Flex>
      )}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={tokenInfoPath || undefined} bold={false} small>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      {!vaultKey && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={earningToken.projectLink} bold={false} small>
            {t('View Project Site')}
          </LinkExternal>
        </Flex>
      )}
      {vaultKey && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href="https://docs.pancakeswap.finance/products/vecake/how-to-get-vecake" bold={false} small>
            {t('View Tutorial')}
          </LinkExternal>
        </Flex>
      )}
      {poolContractAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink
            href={getBlockExploreLink(
              (vaultKey ? cakeVaultContractAddress : poolContractAddress) ?? '',
              'address',
              chainId,
            )}
            bold={false}
            small
          >
            {t('View Contract')}
          </ScanLink>
        </Flex>
      )}
      {account && tokenAddress && (
        <Flex justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <AddToWalletButton
            variant="text"
            p="0"
            height="auto"
            style={{ fontSize: '14px', fontWeight: '400', lineHeight: 'normal' }}
            marginTextBetweenLogo="4px"
            textOptions={AddToWalletTextOptions.TEXT}
            tokenAddress={tokenAddress}
            tokenSymbol={earningToken.symbol}
            tokenDecimals={earningToken.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
    </>
  )
}

export default memo(PoolStatsInfo)
