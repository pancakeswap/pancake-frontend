/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { merge } from 'lodash'
import { Proposal, ProposalState, VotingStatus, VotingState } from 'state/types'
import { getProposals } from './helpers'

const initialState: VotingState = {
  status: VotingStatus.IDLE,
  proposals: {},
  votes: {},
}

// Thunks
export const fetchProposals = createAsyncThunk<
  Proposal[],
  { first?: number; skip?: number; state?: ProposalState } | undefined
>('voting/fetchProposals', async ({ first, skip = 0, state = ProposalState.ACTIVE }) => {
  const response = await getProposals(first, skip, state)
  return response
})

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
  },
})

export default votingSlice.reducer
