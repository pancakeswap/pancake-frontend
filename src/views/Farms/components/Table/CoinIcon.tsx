import React from 'react'
import styled from 'styled-components'

export interface CoinIconProps {
  image: string
}

const IconImage = styled.img`
  width: 24px;
  height: 24px;
`

const CoinIcon: React.FunctionComponent<CoinIconProps> = ({ image }) => {
  return <IconImage src={`/images/farms/${image}.svg`} alt="icon" />
}

export default CoinIcon
