import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import {
  Flex,
  MetamaskIcon,
  CardFooter,
  ExpandableLabel,
  Text,
  LinkExternal,
  TimerIcon,
  Skeleton,
} from '@pancakeswap-libs/uikit'
import { BASE_URL } from 'config'
import { Address } from 'config/constants/types'
import { useBlock } from 'state/hooks'
import { registerToken } from 'utils/wallet'
import Balance from 'components/Balance'

interface FooterProps {
  projectLink: string
  decimals: number
  totalStaked: BigNumber
  tokenName: string
  tokenAddress: string
  tokenDecimals: number
  startBlock: number
  endBlock: number
  isFinished: boolean
  stakingTokenSymbol: string
  contractAddress: Address
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
  }
`

const ExpandableButtonWrapper = styled(Flex)`
  button {
    padding: 0;
  }
`

const Footer: React.FC<FooterProps> = ({
  projectLink,
  decimals,
  tokenAddress,
  totalStaked,
  tokenName,
  tokenDecimals,
  isFinished,
  startBlock,
  endBlock,
  stakingTokenSymbol,
  contractAddress,
}) => {
  const TranslateString = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)
  const { account } = useWeb3React()
  const { currentBlock } = useBlock()
  const imageSrc = `${BASE_URL}/images/tokens/${tokenName.toLowerCase()}.png`
  const isMetaMaskInScope = !!(window as WindowChain).ethereum?.isMetaMask

  const shouldShowBlockCountdown = Boolean(startBlock && endBlock)
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0
  const poolContractAddress = contractAddress[process.env.REACT_APP_CHAIN_ID]

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && (
        <ExpandedWrapper flexDirection="column">
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
            <Text fontSize="14px">{TranslateString(999, 'Total staked:')}</Text>
            <Flex alignItems="flex-start">
              {totalStaked ? (
                <>
                  <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(totalStaked, decimals)} />
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
              <Text fontSize="14px">
                {hasPoolStarted ? TranslateString(410, 'End') : TranslateString(1212, 'Start')}:
              </Text>
              <Flex alignItems="center">
                <Balance
                  color="primary"
                  fontSize="14px"
                  isDisabled={isFinished}
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
                onClick={() => registerToken(tokenAddress, tokenName, tokenDecimals, imageSrc)}
              >
                Add to Metamask
              </Text>
              <MetamaskIcon ml="4px" />
            </Flex>
          )}
        </ExpandedWrapper>
      )}
    </CardFooter>
  )
}

export default React.memo(Footer)
