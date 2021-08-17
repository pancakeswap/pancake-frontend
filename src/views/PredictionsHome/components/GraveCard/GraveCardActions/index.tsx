import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button } from '@rug-zombie-libs/uikit'
import { useHistory } from 'react-router'
import tokens from '../../../../../config/constants/tokens'
import { getAddress } from '../../../../../utils/addressHelpers'
import { getBep20Contract, getContract } from '../../../../../utils/contractHelpers'
import { routes } from '../../../../../routes'
import { auctionById } from '../../../../../redux/get'

const InlineText = styled(Text)`
  display: inline;
`

async function getZombieAllowance(account, setState) {

  // zombie.methods.allowance(account, getRestorationChefAddress()).call()
  //   .then(amount => {
  //     lastZombieAllowanceQuery = Date.now()
  //     const allowance = new BigNumber(amount)
  //     setState(allowance)
  //   })
  //   .catch(() => {
  //     console.log('Failed to get zombie allowance')
  //   })
}

async function getTokenAllowance(account, token, setState, resetTimer, web3) {
  const tokenContract = getBep20Contract(getAddress(token.address), web3)
  // tokenContract.methods.allowance(account, getRestorationChefAddress()).call()
  //   .then(amount => {
  //     resetTimer()
  //     const allowance = new BigNumber(amount)
  //     setState(allowance)
  //   })
  //   .catch(() => {
  //     console.log(`Failed to get ${token.symbol} allowance`)
  //   })
}

const GraveCardActions: React.FC<{ id: number }> = ({ id }) => {
  const history = useHistory()
  const { bt } = auctionById(id)
  return (
    <Flex flexDirection='column'>
      <Flex flexDirection='column'>
        <Box display='inline'>
          <InlineText
            color="textSubtle"
            textTransform='uppercase'
            bold
            fontSize='12px'
          >
            Bid Token:&nbsp;
          </InlineText>
          <InlineText
            color="secondary"
            textTransform='uppercase'
            bold
            fontSize='12px'
          >
            {bt}
          </InlineText>
        </Box>
        <br/>
        <Button onClick={() => history.push(`${routes.MAUSOLEUM }${ id}`)}>ENTER</Button>
      </Flex>
    </Flex>
  )
}

export default GraveCardActions
