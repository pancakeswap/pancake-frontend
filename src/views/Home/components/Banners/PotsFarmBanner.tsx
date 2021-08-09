import React from 'react'
import styled from 'styled-components'
import { Text, Heading } from '@pancakeswap/uikit'

const Wrapper = styled.div`
  border-radius: 32px;
  width: 100%;
  background-image: linear-gradient(#7645d9, #452a7a);
  max-height: max-content;
  overflow: hidden;

  padding: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 40px;
  }
`

const PotsFarmBanner = () => {
  return (
    <Wrapper>
      <Heading color="#ffffff" mb="16px">
        Unfortunately there was an error with the deployment of the POTS-BUSD farm which has caused the APR across all
        farms to drop as a result.
      </Heading>
      <Heading color="#ffffff" mb="16px">
        APR will return to normal at approximately 5pm UTC and a new POTS-BUSD farm will go live at 5:30pm UTC.
      </Heading>
      <Text color="#ffffff">Thanks for your understanding and we apologize for any inconvenience caused.</Text>
    </Wrapper>
  )
}

export default PotsFarmBanner
