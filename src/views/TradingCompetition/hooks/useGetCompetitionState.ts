import { useState, useEffect } from 'react'
import { useInitialBlock } from '../../../state/hooks'
import { CompetitionState } from '../config'

const useGetCompetitionState = () => {
  const [targetBlock, setTargetBlock] = useState(null)
  const [competitionState, setCompetitionState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const currentBlock = useInitialBlock()

  useEffect(() => {
    const liveBlock = CompetitionState.LIVE.startBlock
    const finishedBlock = CompetitionState.FINISHED.startBlock

    if (currentBlock < liveBlock) {
      setTargetBlock(liveBlock)
      setCompetitionState(CompetitionState.REGISTRATION)
    } else if (currentBlock < finishedBlock) {
      setTargetBlock(finishedBlock)
      setCompetitionState(CompetitionState.LIVE)
    } else {
      setTargetBlock(0)
      setCompetitionState(CompetitionState.FINISHED)
    }
  }, [currentBlock])

  useEffect(() => {
    if (currentBlock > 0 && targetBlock && competitionState && isLoading) {
      setIsLoading(false)
    }
  }, [currentBlock, targetBlock, competitionState, isLoading])

  return { targetBlock, competitionState, isLoading }
}

export default useGetCompetitionState
