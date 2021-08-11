import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading } from '@ricefarm/uikitv2'
import { CommunityTag, CoreTag } from 'components/Tags'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
  isTokenOnly?: boolean
  index?: number
  depositFee?: number
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, multiplier, isCommunityFarm, token, quoteToken, isTokenOnly }) => {
  const variant= isTokenOnly ? 'default' : 'inverted';
  const secondary = isTokenOnly ? {
    symbol: 'RICE',
    address: {
      56: '0xC4eEFF5aab678C3FF32362D80946A3f5De4a1861',
      97: '0xAb14aE27665F077AC2f8c08dFdCf011D80a3640C',
    },
    decimals: 18,
    projectLink: 'https://ricefarm.fi/',
  } : quoteToken;
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <TokenPairImage variant={variant} primaryToken={token} secondaryToken={secondary} width={64} height={64}/>

      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
        <Flex justifyContent="center">
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
