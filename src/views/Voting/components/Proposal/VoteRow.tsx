import React from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal } from '@pancakeswap/uikit'
import { Vote } from '../../types'

interface VoteRowProps {
  vote: Vote
}

const AddressCol = styled.div`
  width: 150px;
`

const StyledVoteRow = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};

  padding: 16px 24px;
`

const VoteRow: React.FC<VoteRowProps> = ({ vote }) => {
  return (
    <StyledVoteRow>
      <AddressCol>
        <LinkExternal href={`https://bscscan.com/address/${vote.voter}`}>
          {`${vote.voter.substring(0, 4)}...${vote.voter.substring(vote.voter.length - 4)}`}
        </LinkExternal>
      </AddressCol>
    </StyledVoteRow>
  )
}

export default VoteRow
