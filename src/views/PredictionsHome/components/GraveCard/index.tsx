import React, { useState } from 'react'
import styled from 'styled-components'
import { CardBody, Flex, Image, Text } from '@rug-zombie-libs/uikit'
import UnlockButton from 'components/UnlockButton'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import MinimumStake from './MinimumStake'
import StyledCard from './StyledCard'
import StyledCardHeader from './StyledCardHeader'
import { GraveConfig } from '../../../../config/constants/types'
import MinimumStakingTime from './MinimumStakingTime'
import GraveCardActions from './GraveCardActions'
import CardFooter from './CardFooter'
import { BIG_TEN } from '../../../../utils/bigNumber'
import useTokenBalance from '../../../../hooks/useTokenBalance'
import { getAddress, getZombieAddress } from '../../../../utils/addressHelpers'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

const GraveCard: React.FC<{
  grave: GraveConfig,
  zombiePrice: BigNumber,
  userData: any,
  gid: number;
  account: string,
  balances: any,
  isLoading: boolean
  web3: Web3
}> = ({ grave, zombiePrice, userData, gid, account,  balances, isLoading, web3 }) => {
  const allBalances = balances
  allBalances.ruggedToken = useTokenBalance(getAddress(grave.ruggedToken.address))
  const ruggedTokenPrice = BIG_TEN // todo fix
  return (
    <StyledCard isStaking={false} style={{
      minWidth: '350px',
    }}>
      <StyledCardHeader earningTokenSymbol={grave.nftName} stakingTokenSymbol={grave.ruggedToken.symbol}
                        stakingTokenImageUrl={grave.rugSrc} />
      <StyledCardBody isLoading={isLoading}>
        <MinimumStake
          amount={grave.minimumStakingAmount}
          isFinished={false}
        />
        <MinimumStakingTime period={grave.displayMinimumStakingTime} />
        <br />
        <br />
        <Flex justifyContent='center'> {grave.nftName} </Flex>
        <Image
          mx='auto'
          mt='12px'
          src={grave.nftSrc}
          alt='zombie running'
          width={207}
          height={142}
        />
        <Flex mt='24px' flexDirection='column'>
          {account ? (
            <GraveCardActions
              grave={grave}
              userData={userData}
              zombiePrice={zombiePrice}
              ruggedTokenPrice={ruggedTokenPrice}
              unlockingFee={undefined}
              balances={allBalances}
              accountHasSharesStaked={false}
              account={account}
              stakingTokenBalance={undefined}
              isLoading={isLoading}
              web3={web3}
            />
          ) : (
            <>
              <Text mb='10px' textTransform='uppercase' fontSize='12px' color='textSubtle' bold>
                Start reviving
              </Text>
              <UnlockButton />
            </>
          )}
        </Flex>
      </StyledCardBody>
      <CardFooter
        account={account}
        grave={grave}
        userData={userData}
        totalZombieInGrave={BIG_TEN.pow(18)} // todo fix
      />
    </StyledCard>
  )
}

export default GraveCard
