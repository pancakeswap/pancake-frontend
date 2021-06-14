/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { merge } from 'lodash'
import { Proposal, ProposalState, VotingStatus, VotingState, Vote } from 'state/types'
import { getAllVotes, getProposal, getProposals } from './helpers'

const initialState: VotingState = {
  status: VotingStatus.IDLE,
  proposals: {},
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

export const fetchVotes = createAsyncThunk<{ votes: Vote[]; proposalId: string }, string>(
  'voting/fetchVotes',
  async (proposalId) => {
    const response = await getAllVotes(proposalId)
    return { votes: response, proposalId }
  },
)

export const votingSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Proposals
    builder.addCase(fetchProposals.pending, (state) => {
      state.status = VotingStatus.LOADING
    })
    builder.addCase(fetchProposals.fulfilled, (state, action) => {
      const proposals = action.payload.reduce((accum, proposal) => {
        return {
          ...accum,
          [proposal.id]: proposal,
        }
      }, {})

      state.proposals = merge({}, state.proposals, proposals)
      state.status = VotingStatus.IDLE
    })

    // Fetch Proposal
    builder.addCase(fetchProposal.pending, (state) => {
      state.status = VotingStatus.LOADING
    })
    builder.addCase(fetchProposal.fulfilled, (state, action) => {
      state.proposals[action.payload.id] = action.payload
      state.status = VotingStatus.IDLE
    })

    // Fetch Votes
    builder.addCase(fetchVotes.pending, (state) => {
      state.status = VotingStatus.LOADING
    })
    builder.addCase(fetchVotes.fulfilled, (state, action) => {
      const { votes, proposalId } = action.payload

      state.votes = {
        ...state.votes,
        [proposalId]: votes,
      }
      state.status = VotingStatus.IDLE
    })
  },
})

export default votingSlice.reducer
