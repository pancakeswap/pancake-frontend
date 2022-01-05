import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchStatus } from 'config/constants/types'
import merge from 'lodash/merge'
import { Proposal, ProposalState, Vote, VotingState } from 'state/types'
import { getAllVotes, getProposal, getProposals } from './helpers'

const initialState: VotingState = {
  proposalLoadingStatus: FetchStatus.Idle,
  proposals: {},
  voteLoadingStatus: FetchStatus.Idle,
  votes: {},
}

// Thunks
export const fetchProposals = createAsyncThunk<Proposal[], { first?: number; skip?: number; state?: ProposalState }>(
  'voting/fetchProposals',
  async ({ first, skip = 0, state = ProposalState.ACTIVE }) => {
    const response = await getProposals(first, skip, state)
    return response
  },
)

export const fetchProposal = createAsyncThunk<Proposal, string>('voting/fetchProposal', async (proposalId) => {
  const response = await getProposal(proposalId)
  return response
})

export const fetchVotes = createAsyncThunk<
  { votes: Vote[]; proposalId: string },
  { proposalId: string; block?: number }
>('voting/fetchVotes', async ({ proposalId, block }) => {
  const response = await getAllVotes(proposalId, block)
  return { votes: response, proposalId }
})

export const votingSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Proposals
    builder.addCase(fetchProposals.pending, (state) => {
      state.proposalLoadingStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchProposals.fulfilled, (state, action) => {
      const proposals = action.payload.reduce((accum, proposal) => {
        return {
          ...accum,
          [proposal.id]: proposal,
        }
      }, {})

      state.proposals = merge({}, state.proposals, proposals)
      state.proposalLoadingStatus = FetchStatus.Fetched
    })

    // Fetch Proposal
    builder.addCase(fetchProposal.pending, (state) => {
      state.proposalLoadingStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchProposal.fulfilled, (state, action) => {
      state.proposals[action.payload.id] = action.payload
      state.proposalLoadingStatus = FetchStatus.Fetched
    })

    // Fetch Votes
    builder.addCase(fetchVotes.pending, (state) => {
      state.voteLoadingStatus = FetchStatus.Fetching
    })
    builder.addCase(fetchVotes.fulfilled, (state, action) => {
      const { votes, proposalId } = action.payload

      state.votes = {
        ...state.votes,
        [proposalId]: votes,
      }
      state.voteLoadingStatus = FetchStatus.Fetched
    })
  },
})

export default votingSlice.reducer
