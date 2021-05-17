import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
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
} from '@pancakeswap/uikit'
import { BASE_BSC_SCAN_URL, BASE_URL } from 'config'
import { useBlock, useCakeVault } from 'state/hooks'
import { Pool } from 'state/types'
import { getAddress, getCakeVaultAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'

interface ExpandedFooterProps {
  pool: Pool
  account: string
  isAutoVault?: boolean
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account, isAutoVault = false }) => {
  const { t } = useTranslation()
  const { currentBlock } = useBlock()
  const {
    totalCakeInVault,
    fees: { performanceFee },
  } = useCakeVault()

  const { stakingToken, earningToken, totalStaked, startBlock, endBlock, isFinished, contractAddress, sousId } = pool

  const tokenAddress = earningToken.address ? getAddress(earningToken.address) : ''
  const poolContractAddress = getAddress(contractAddress)
  const cakeVaultContractAddress = getCakeVaultAddress()
  const imageSrc = `${BASE_URL}/images/tokens/${earningToken.symbol.toLowerCase()}.png`
  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask
  const isManualCakePool = sousId === 0

  const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-end' },
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

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text small>{t('Total staked:')}</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance fontSize="14px" value={getTotalStakedBalance()} />
              <Text ml="4px" fontSize="14px">
                {stakingToken.symbol}
              </Text>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      {shouldShowBlockCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text small>{hasPoolStarted ? t('End') : t('Start')}:</Text>
          <Flex alignItems="center">
            {blocksRemaining || blocksUntilStart ? (
              <Balance
                color="primary"
                fontSize="14px"
                value={hasPoolStarted ? blocksRemaining : blocksUntilStart}
                decimals={0}
              />
            ) : (
              <Skeleton width="54px" height="21px" />
            )}
            <Text ml="4px" color="primary" small>
              {t('blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Flex>
        </Flex>
      )}
      {isAutoVault && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef} small>
            {t('Performance Fee')}
          </TooltipText>
          <Flex alignItems="center">
            <Text ml="4px" small>
              {performanceFee / 100}%
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal bold={false} small href={earningToken.projectLink}>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            bold={false}
            small
            href={`${BASE_BSC_SCAN_URL}/address/${isAutoVault ? cakeVaultContractAddress : poolContractAddress}`}
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
            onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals, imageSrc)}
          >
            <Text color="primary" fontSize="14px">
              Add to Metamask
            </Text>
            <MetamaskIcon ml="4px" />
          </Button>
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
