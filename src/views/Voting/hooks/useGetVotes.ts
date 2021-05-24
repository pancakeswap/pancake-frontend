import { useEffect, useRef, useState } from 'react'
import { getVotes } from '../helpers'
import { Vote } from '../types'

interface State {
  isFinished: boolean
  votes: Vote[]
}

const useGetVotes = (proposalId: string, votesPerCall = 100) => {
  const isLooping = useRef(true)
  const [state, setState] = useState<State>({
    isFinished: false,
    votes: [],
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

  return state
}

export default useGetVotes
