import React from 'react'
import styled from 'styled-components'

export interface CoinIconProps {
  image: string
}

const IconImage = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`

const CoinIcon: React.FunctionComponent<CoinIconProps> = ({ image }) => {
  return (
    <>
      <IconImage src={`/images/farms/${image}.svg`} alt="icon" />
    </>
  )
}

export default CoinIcon
