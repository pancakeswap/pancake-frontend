import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link } from '@pancakeswap-libs/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({ bscScanAddress, removed, totalValueFormated, lpLabel }) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(316, 'Stake')}:</Text>
        <Text>{lpLabel}</Text>
      </Flex>
      {!removed && (
        <Flex justifyContent="space-between">
          <Text>{TranslateString(23, 'Total Liquidity')}:</Text>
          <Text>{totalValueFormated}</Text>
        </Flex>
      )}
      <Flex justifyContent="flex-start">
        <Link external href={bscScanAddress} target="_blank" bold={false}>
          {TranslateString(356, 'View on BscScan')}
        </Link>
      </Flex>
    </Wrapper>
  )
}

export default DetailsSection
