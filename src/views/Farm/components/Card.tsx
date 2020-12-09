import styled from 'styled-components'
import { Card as CardUIKIT } from '@pancakeswap-libs/uikit'

const Card = styled(CardUIKIT)`
  padding: 24px;
`

const CardImage = styled.img`
  height: 48px;
  margin-bottom: 16px;
  width: 48px;
`

export { Card, CardImage }
