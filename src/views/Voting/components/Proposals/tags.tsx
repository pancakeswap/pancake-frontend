import React from 'react'
import { TagProps } from '@pancakeswap/uikit'
import { ClosedTag, CommunityTag, CoreTag, SoonTag, VoteNowTag } from 'components/Tags'
import { ProposalState } from '../../types'

export const ProposalStateTag: React.FC<{ proposalState: ProposalState }> = ({ proposalState }) => {
  if (proposalState === ProposalState.ACTIVE) {
    return <VoteNowTag />
  }

  if (proposalState === ProposalState.PENDING) {
    return <SoonTag />
  }

  return <ClosedTag />
}

interface ProposalTypeTagProps extends TagProps {
  isCoreProposal: boolean
}

export const ProposalTypeTag: React.FC<ProposalTypeTagProps> = ({ isCoreProposal, ...props }) => {
  if (isCoreProposal) {
    return <CoreTag {...props} />
  }
  return <CommunityTag {...props} />
}
