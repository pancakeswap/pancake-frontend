import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
  Link,
  HelpIcon,
} from '@pancakeswap/uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { useBlock } from 'state/block/hooks'
import { useCakeVault } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBscScanLink } from 'utils'
import Balance from 'components/Balance'
import { getPoolBlockInfo } from 'views/Pools/helpers'

interface ExpandedFooterProps {
  pool: DeserializedPool
  account: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { currentBlock } = useBlock()
  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    contractAddress,
    sousId,
    isAutoVault,
  } = pool

  const tokenAddress = earningToken.address || ''
  const poolContractAddress = getAddress(contractAddress)
  const cakeVaultContractAddress = getCakeVaultAddress()
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const isManualCakePool = sousId === 0

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const getTotalStakedBalance = () => {
    if (isAutoVault) {
      return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
    }
    if (isManualCakePool) {
      const manualCakeTotalMinusAutoVault = new BigNumber(totalStaked).minus(totalCakeInVault)
      return getBalanceNumber(manualCakeTotalMinusAutoVault, stakingToken.decimals)
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

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked')}:</Text>
        <Flex alignItems="flex-start">
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance small value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
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
      {stakingLimit && stakingLimit.gt(0) && (
        <Flex mb="2px" justifyContent="space-between">
          <Text small>{t('Max. stake per user')}:</Text>
          <Text small>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${stakingToken.symbol}`}</Text>
        </Flex>
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
      {isAutoVault && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef} small>
            {t('Performance Fee')}
          </TooltipText>
          <Flex alignItems="center">
            {performanceFee ? (
              <Text ml="4px" small>
                {performanceFee / 100}%
              </Text>
            ) : (
              <Skeleton width="90px" height="21px" />
            )}
          </Flex>
        </Flex>
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
            href={`${BASE_BSC_SCAN_URL}/address/${isAutoVault ? cakeVaultContractAddress : poolContractAddress}`}
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
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
