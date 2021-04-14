import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import { Flex, MetamaskIcon, CardFooter, ExpandableLabel, Text, LinkExternal, TimerIcon } from '@pancakeswap-libs/uikit'
import Balance from 'components/Balance'
import { useBlock } from 'state/hooks'
import { registerToken } from 'utils/wallet'
import { BASE_URL } from 'config'

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
}

const ExpandedWrapper = styled(Flex)`
  svg {
    height: 14px;
    width: 14px;
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
}) => {
  const { currentBlock } = useBlock()
  const [isExpanded, setIsExpanded] = useState(false)
  const TranslateString = useI18n()

  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)

  const imageSrc = `${BASE_URL}/images/tokens/${tokenName.toLowerCase()}.png`

  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0

  return (
    <CardFooter>
      <Flex>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')}
        </ExpandableLabel>
      </Flex>
      {isExpanded && (
        <ExpandedWrapper flexDirection="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="14px">{TranslateString(999, 'Total staked:')}</Text>
            <Flex alignItems="flex-start">
              <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(totalStaked, decimals)} />
              <Text ml="4px" fontSize="14px">
                {stakingTokenSymbol}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
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
          <Flex mb="4px" justifyContent="flex-end">
            <LinkExternal bold={false} fontSize="14px" href={projectLink} target="_blank">
              {TranslateString(412, 'View project site')}
            </LinkExternal>
          </Flex>
          {tokenAddress && (
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
