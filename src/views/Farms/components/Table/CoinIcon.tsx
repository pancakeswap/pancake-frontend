import React from 'react'
import styled from 'styled-components'

export interface CoinIconProps {
  image: string
}

const IconImage = styled.img`
  min-width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.5rem;
`

const CoinIcon: React.FunctionComponent<CoinIconProps> = ({ image }) => {
  return (
    <>
      <IconImage src={`/images/farms/${image}.svg`} alt="icon" />
    </>
  )
}

export default CoinIcon
