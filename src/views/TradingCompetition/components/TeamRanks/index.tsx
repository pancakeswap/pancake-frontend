import React from 'react'
import styled from 'styled-components'
import { Flex, Box, Image } from '@pancakeswap-libs/uikit'
import CakerBunny from '../../pngs/cakers.png'
import TopTradersCard from './TopTradersCard'
import Podium from './Podium'

const Wrapper = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const StyledPodiumWrapper = styled(Flex)`
  margin: 0 0 40px 0;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
    margin: 0 40px 0 0;
  }
`

const BunnyImageWrapper = styled(Box)`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    width: 200px;
    height: 205px;
  }
`

const StyledTopTradersWrapper = styled(Flex)`
  flex: 1;
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 2;
  }
`

const TeamRanks = () => {
  return (
    <>
      <Wrapper>
        <StyledPodiumWrapper flexDirection="column">
          <Podium />
          <BunnyImageWrapper>
            <Image src={CakerBunny} width={200} height={205} />
          </BunnyImageWrapper>
        </StyledPodiumWrapper>
        <StyledTopTradersWrapper>
          <TopTradersCard />
        </StyledTopTradersWrapper>
      </Wrapper>
    </>
  )
}

export default TeamRanks
