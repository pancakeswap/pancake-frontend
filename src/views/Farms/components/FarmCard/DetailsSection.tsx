import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Text, Flex, LinkExternal } from '@pancakeswap/uikit'

export interface ExpandableSectionProps {
  bscScanAddress?: string
  infoAddress?: string
  removed?: boolean
  totalValueFormatted?: string
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
  infoAddress,
  removed,
  totalValueFormatted,
  lpLabel,
  addLiquidityUrl,
}) => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{t('Total Liquidity')}:</Text>
        <Text>{totalValueFormatted}</Text>
      </Flex>
      {!removed && (
        <StyledLinkExternal href={addLiquidityUrl}>{t(`Get ${lpLabel}`, { name: lpLabel })}</StyledLinkExternal>
      )}
      <StyledLinkExternal href={bscScanAddress}>{t('View Contract')}</StyledLinkExternal>
      <StyledLinkExternal href={infoAddress}>{t('See Pair Info')}</StyledLinkExternal>
    </Wrapper>
  )
}

export default DetailsSection
