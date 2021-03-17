import React from 'react'
import styled from 'styled-components'
import ScoreCard from './ScoreCard'
import ScoreHeading from './ScoreHeading'
import { YourScoreProps } from '../../types'

const Wrapper = styled.div`
  margin: 24px auto 0;
  max-width: 680px;
`

const YourScore: React.FC<YourScoreProps> = ({ registered = false }) => {
  return (
    <Wrapper>
      {registered && <ScoreHeading />}
      <ScoreCard registered={registered} />
    </Wrapper>
  )
}

export default YourScore
