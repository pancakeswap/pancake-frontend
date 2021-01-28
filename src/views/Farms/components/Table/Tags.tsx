import React from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { communityFarms } from 'config/constants'
import { CommunityTag, CoreTag } from 'components/Tags'

const StyledCommunityTag = styled(CommunityTag)`
  height: 1.5rem;
  padding: 0 0.375rem;
  svg {
    width: 0.875rem;
  }
`

const StyledCoreTag = styled(CoreTag)`
  height: 1.5rem;
  padding: 0 0.375rem;

  svg {
    width: 0.875rem;
  }
`

const Tags: React.FunctionComponent<FarmWithStakedValue> = ({ tokenSymbol }) => {
  const isCommunityFarm = communityFarms.includes(tokenSymbol)

  return <>{isCommunityFarm ? <StyledCommunityTag /> : <StyledCoreTag />}</>
}

export default Tags
