import React from 'react'
import styled from 'styled-components'
import HarvestButton from 'views/Pools/components/HarvestButton'

const Amount = styled.span`
  margin-right: 3rem;
`

const Earned: React.FunctionComponent = () => {
  return (
    <>
      <Amount>
        ?
      </Amount>
      <HarvestButton disabled>
        Harvest
      </HarvestButton>
    </>
  )
}

export default Earned