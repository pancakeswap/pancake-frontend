import React, { createContext, useState } from 'react'
import { Vote } from 'state/types'
import { getVotes } from '../helpers'

const VOTES_PER_CHUNK = 500

export enum VoteState {
  IDLE = 'idle',
  LOADING = 'loading',
  FINISHED = 'finished',
}

export interface State {
  state: VoteState
  votes: Vote[]
}

export interface VoteContextApi extends State {
  fetchVotes: (proposal: string) => void
}

export const VoterContext = createContext<VoteContextApi>(undefined)

const VoteProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<State>({
    state: VoteState.IDLE,
    votes: [],
  })

  const fetchVotes = async (proposal: string) => {
    setState((prevState) => ({
      ...prevState,
      state: VoteState.LOADING,
    }))

    const fetchVotesChunk = async (newSkip: number) => {
      const votes = await getVotes(VOTES_PER_CHUNK, newSkip, { proposal })

      if (votes.length === 0) {
        setState((prevState) => ({
          ...prevState,
          state: VoteState.FINISHED,
        }))
      } else {
        setState((prevState) => ({
          ...prevState,
          votes: [...prevState.votes, ...votes],
        }))
        fetchVotesChunk(newSkip + VOTES_PER_CHUNK)
      }
    }

    fetchVotesChunk(0)
  }

  return <VoterContext.Provider value={{ ...state, fetchVotes }}>{children}</VoterContext.Provider>
}

export default VoteProvider
