import React from 'react'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Text, Flex, Link } from '@pancakeswap-libs/uikit'
import { CommunityTag, CoreTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  farmImage?: string
  tokenSymbol?: string
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 16px;
`

const Multiplier = styled.div`
  line-height: 25px;
  padding: 0 8px;
  background: #25beca;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.background};
  font-weight: 900;
  margin-bottom: 8px;
  display: inline-block;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  farmImage,
  tokenSymbol,
}) => {
  const TranslateString = useI18n()

  return (
    <Wrapper>
      <Flex>
        <Flex flexDirection="column" alignItems="flex-start">
          <Multiplier>{multiplier}</Multiplier>
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}
        </Flex>
        <img src={`/images/farms/${farmImage}.svg`} alt={tokenSymbol} />
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
