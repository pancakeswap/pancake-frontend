import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import { Flex, CardFooter, ExpandableLabel } from '@pancakeswap-libs/uikit'
import { Address } from 'config/constants/types'
import ExpandedFooter from './ExpandedFooter'

interface FooterProps {
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
}

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
  tokenSymbol,
  tokenDecimals,
  isFinished,
  startBlock,
  endBlock,
  stakingTokenSymbol,
  contractAddress,
}) => {
  const TranslateString = useI18n()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <CardFooter>
      <ExpandableButtonWrapper>
        <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')}
        </ExpandableLabel>
      </ExpandableButtonWrapper>
      {isExpanded && (
        <ExpandedFooter
          projectLink={projectLink}
          decimals={decimals}
          totalStaked={totalStaked}
          startBlock={startBlock}
          endBlock={endBlock}
          isFinished={isFinished}
          tokenSymbol={tokenSymbol}
          tokenAddress={tokenAddress}
          tokenDecimals={tokenDecimals}
          stakingTokenSymbol={stakingTokenSymbol}
          contractAddress={contractAddress}
        />
      )}
    </CardFooter>
  )
}

export default Footer
