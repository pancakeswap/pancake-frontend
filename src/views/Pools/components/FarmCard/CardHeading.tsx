import React from 'react'
import styled from 'styled-components'
import { Flex} from '@pancakeswap/uikit'
import variables from 'style/variables'
import { CommunityTag, CoreTag } from 'components/Tags'
import { Token } from 'config/constants/types'
import { TokenPairImage } from 'components/TokenImage'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
  
`
const Heading = styled.p`
color:#fff;
font-size:2rem;
`;

const MultiplierTag = styled("button")`
  margin-left: 4px;
  margin-bottom:10px;
  background-color: #FEDD40;
  padding: 4px 30px;
  border-radius: ${variables.radius};
  border: none;
  font-size: 16px;
  font-weight: 600;
        
  
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel, multiplier, isCommunityFarm, token, quoteToken }) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <img src="/images/farms/farmsCardLogo.svg"  alt="" />
      <Flex flexDirection="column" alignItems="flex-end">
        <Flex justifyContent="center">
          <MultiplierTag> {multiplier} </MultiplierTag>
        </Flex>
        <Heading> {lpLabel.split(' ')[0]} </Heading>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
