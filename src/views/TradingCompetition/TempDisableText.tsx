import { Link, Text } from '@pancakeswap/uikit'
import React from 'react'
import styled from 'styled-components'

const StyledTempDisableText = styled(Text)`
  text-align: center;
  * {
    display: inline;
  }
`

/**
 * Temporary disable for top 500 users, should remove later
 */
export const TempDisableText = () => {
  return (
    <StyledTempDisableText color="tertiary">
      Claiming for Top 500 players will be available soon. Follow our{' '}
      <Link external href="https://twitter.com/pancakeswap">
        Twitter
      </Link>{' '}
      to catch the latest updates.
    </StyledTempDisableText>
  )
}
