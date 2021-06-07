import { useEffect, useRef, useState } from 'react'
import { getVoteCache, getVotes } from '../helpers'
import { Vote } from '../types'

interface State {
  isFinished: boolean
  votes: Vote[]
  voteCache: {
    [key: string]: number
  }
}

const useGetVotes = (proposalId: string, votesPerCall = 1000) => {
  const isLooping = useRef(true)
  const [state, setState] = useState<State>({
    isFinished: false,
    votes: [],
    voteCache: {},
  })

  useEffect(() => {
    const fetchVotes = async (newSkip: number) => {
      const votes = await getVotes(votesPerCall, newSkip, { proposal: proposalId })

      if (isLooping.current) {
        if (votes.length === 0) {
          setState((prevState) => ({
            ...prevState,
            isFinished: true,
          }))
        } else {
          setState((prevState) => ({
            ...prevState,
            votes: [...prevState.votes, ...votes],
          }))
          fetchVotes(newSkip + votesPerCall)
        }
      }
    }

    fetchVotes(0)

    return () => {
      isLooping.current = false
    }
  }, [proposalId, votesPerCall, setState, isLooping])

  useEffect(() => {
    const fetchVoteCache = async () => {
      try {
        const response = await getVoteCache(proposalId)

        setState((prevState) => ({
          ...prevState,
          voteCache: response,
        }))
      } catch (error) {
        console.error('Unable to fetch vote cache', error)
      }
    }

    fetchVoteCache()
  }, [proposalId, setState])

  return state
}

export default useGetVotes
