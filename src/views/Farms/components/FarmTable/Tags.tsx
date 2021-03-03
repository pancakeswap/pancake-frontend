import React from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/FarmCard'
import { communityFarms } from 'config/constants'
import { CommunityTag, CoreTag, DualTag } from 'components/Tags'

const StyledCommunityTag = styled(CommunityTag)`
  height: 24px;
  padding: 0 6px;
  svg {
    width: 14px;
  }
`

const StyledCoreTag = styled(CoreTag)`
  height: 24px;
  padding: 0 6px;

  svg {
    width: 14px;
  }
`

const StyledDualTag = styled(DualTag)`
  height: 24px;
  padding: 0 6px;
  margin-left: 4px;

  svg {
    width: 14px;
  }
`

const Tags: React.FunctionComponent<FarmWithStakedValue> = ({ tokenSymbol, dual }) => {
  const isCommunityFarm = communityFarms.includes(tokenSymbol)

  return (
    <>
      {isCommunityFarm ? <StyledCommunityTag /> : <StyledCoreTag />}
      {dual && <StyledDualTag />}
    </>
  )
}

export default Tags
