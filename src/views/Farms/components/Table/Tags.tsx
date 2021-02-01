import React from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { communityFarms } from 'config/constants'
import { CommunityTag, CoreTag, DualTag } from 'components/Tags'

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

const StyledDualTag = styled(DualTag)`
  height: 1.5rem;
  padding: 0 0.375rem;
  margin-left: 0.25rem;

  svg {
    width: 0.875rem;
  }
`

const Tags: React.FunctionComponent<FarmWithStakedValue> = ({ tokenSymbol, dual }) => {
  const isCommunityFarm = communityFarms.includes(tokenSymbol)

  return (
    <>
      {isCommunityFarm ? <StyledCommunityTag /> : <StyledCoreTag />}
      {dual ? <StyledDualTag /> : null}
    </>
  )
}

export default Tags
