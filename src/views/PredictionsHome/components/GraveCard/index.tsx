import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, CardBody, Flex, Image, Text } from '@rug-zombie-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import StartingBid from './StartingBid'
import StyledCard from './StyledCard'
import StyledCardHeader from './StyledCardHeader'
import { GraveConfig } from '../../../../config/constants/types'
import MinimumStakingTime from './MinimumStakingTime'
import GraveCardActions from './GraveCardActions'
import CardFooter from './CardFooter'
import { BIG_TEN } from '../../../../utils/bigNumber'
import useTokenBalance from '../../../../hooks/useTokenBalance'
import { getAddress, getZombieAddress } from '../../../../utils/addressHelpers'
import { account, auctionByAid } from '../../../../redux/get'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

const AuctionCard: React.FC<{
  aid: number
}> = ({ aid }) => {
  const { prize, prizeSymbol, path } = auctionByAid(aid)
  const isLoading = false
  return (
    <StyledCard isStaking={false} style={{
      minWidth: '350px',
    }} >
      <StyledCardHeader aid={aid}/>
      <StyledCardBody isLoading={isLoading}>
        <StartingBid
          aid={aid}
        />
        <MinimumStakingTime period="1000" />
        <br />
        <br />
        <Flex justifyContent='center'> {prize} </Flex>
        <br/>
        <Flex justifyContent="center">
          <img
            src={path}
            alt='auction prize'
            style={{width: "50%"}}
          />
        </Flex>
        <Flex mt='24px' flexDirection='column'>
          {account() ? (
            <GraveCardActions aid={aid}/>
          ) : (
            <>
              <UnlockButton />
            </>
          )}
        </Flex>
      </StyledCardBody>
      <CardFooter aid={aid} />
    </StyledCard>
  )
}

export default AuctionCard
