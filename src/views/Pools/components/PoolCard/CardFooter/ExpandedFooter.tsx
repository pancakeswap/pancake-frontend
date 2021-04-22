import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import { Flex, MetamaskIcon, Text, LinkExternal, TimerIcon, Skeleton } from '@pancakeswap-libs/uikit'
import { BASE_URL } from 'config'
import { Address } from 'config/constants/types'
import { useBlock } from 'state/hooks'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'

interface ExpandedFooterProps {
  projectLink: string
  decimals: number
  totalStaked: BigNumber
  tokenSymbol: string
  tokenAddress: string
  tokenDecimals: number
  startBlock: number
  endBlock: number
  isFinished: boolean
  stakingTokenSymbol: string
  contractAddress: Address
  account: string
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({
  projectLink,
  decimals,
  tokenAddress,
  totalStaked,
  tokenSymbol,
  tokenDecimals,
  isFinished,
  startBlock,
  endBlock,
  stakingTokenSymbol,
  contractAddress,
  account,
}) => {
  const TranslateString = useI18n()
  const imageSrc = `${BASE_URL}/images/tokens/${tokenSymbol.toLowerCase()}.png`
  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask
  const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
  const { currentBlock } = useBlock()
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0
  const poolContractAddress = contractAddress[process.env.REACT_APP_CHAIN_ID]

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="2px" justifyContent="space-between" alignItems="center">
        <Text fontSize="14px">{TranslateString(999, 'Total staked:')}</Text>
        <Flex alignItems="flex-start">
          {totalStaked ? (
            <>
              <Balance fontSize="14px" value={getBalanceNumber(totalStaked, decimals)} />
              <Text ml="4px" fontSize="14px">
                {stakingTokenSymbol}
              </Text>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
        </Flex>
      </Flex>
      {shouldShowBlockCountdown && (
        <Flex mb="2px" justifyContent="space-between" alignItems="center">
          <Text fontSize="14px">{hasPoolStarted ? TranslateString(410, 'End') : TranslateString(1212, 'Start')}:</Text>
          <Flex alignItems="center">
            <Balance
              color="primary"
              fontSize="14px"
              value={hasPoolStarted ? blocksRemaining : blocksUntilStart}
              decimals={0}
            />
            <Text ml="4px" color="primary" fontSize="14px">
              {TranslateString(999, 'blocks')}
            </Text>
            <TimerIcon ml="4px" color="primary" />
          </Flex>
        </Flex>
      )}
      <Flex mb="2px" justifyContent="flex-end">
        <LinkExternal bold={false} fontSize="14px" href={projectLink} target="_blank">
          {TranslateString(412, 'View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            bold={false}
            fontSize="14px"
            href={`https://bscscan.com/address/${poolContractAddress}`}
            target="_blank"
          >
            {TranslateString(412, 'View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {tokenAddress && (
        <Flex mb="2px" justifyContent="flex-end">
          <LinkExternal
            bold={false}
            fontSize="14px"
            href={`https://pancakeswap.info/token/${tokenAddress}`}
            target="_blank"
          >
            {TranslateString(412, 'View Pool Info')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokenAddress && (
        <Flex justifyContent="flex-end">
          <Text
            color="primary"
            fontSize="14px"
            onClick={() => registerToken(tokenAddress, tokenSymbol, tokenDecimals, imageSrc)}
          >
            Add to Metamask
          </Text>
          <MetamaskIcon ml="4px" />
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
