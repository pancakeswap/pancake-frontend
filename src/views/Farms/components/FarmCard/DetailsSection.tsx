import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, LinkExternal } from '@pancakeswap-libs/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  removed?: boolean
  totalValueFormated?: string
  lpLabel?: string
  addLiquidityUrl?: string
}

const Wrapper = styled.div`
  margin-top: 24px;
`

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
`

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  bscScanAddress,
  removed,
  totalValueFormated,
  lpLabel,
  addLiquidityUrl,
}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(354, 'Total Liquidity')}:</Text>
        <Text>{totalValueFormated}</Text>
      </Flex>
      {!removed && (
        <StyledLinkExternal href={addLiquidityUrl}>
          {TranslateString(999, `Get ${lpLabel}`, { name: lpLabel })}
        </StyledLinkExternal>
      )}
      <StyledLinkExternal href={bscScanAddress}>{TranslateString(999, 'View Contract')}</StyledLinkExternal>
    </Wrapper>
  )
}

export default DetailsSection
